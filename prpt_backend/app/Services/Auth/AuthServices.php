<?php

namespace App\Services\Auth;


use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ApiRefreshTokenRequest;
use App\Models\User;
use App\Notifications\SetUserPasswordNotification;
use App\Traits\ApiTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Passport\RefreshToken;
use Laravel\Passport\Client as OClient;
use Mail;
use Str;

class AuthServices implements AuthServicesInterface
{
    use ApiTrait;
    public function login(LoginRequest $request)
    {
        try {
            $array = ['email' => request('email'),
                'password' => request('password')];

            if (Auth::guard('web')->attempt($array)) {
                $oClient = OClient::whereJsonContains('grant_types', ['password'])->first();
                $params = [
                    'grant_type' => 'password',
                    'client_id' => $oClient->id,
                    'client_secret' => env('PASSPORT_CLIENT_SECRET'),
                    'username' => request('email'),
                    'password' => request('password'),
                    'scope' => '*',
                ];

                $proxy = Request::create('/oauth/token', 'POST', $params);
                $proxy->headers->set('Accept', 'application/json');
                $response = app()->handle($proxy);
                $credentials = json_decode($response->getContent(), true);
                Log::info('credentials', $credentials);
                $user = Auth::guard('web')->user();
//                $user->update([
//                    'device_token' => $request->request->get('device_token')
//                ]);

                //$permission = $this->configRepository->getPermissionList($user->id);

                return $this->successLoginResponse($user, $credentials)
                    ->cookie(
                        'refresh_token',           // name
                        $credentials['refresh_token'], // value
                        60 * 24 * 7,               // minutes (7 days)
                        '/',                       // path
                        null,                      // domain
                        false,                      // secure (HTTPS only)
                        true,                      // httpOnly — JS cannot read this
                        false,                     // raw
                        'lax'                   // sameSite
                    );
            } else {
                return $this->unauthorized();
            }
        } catch (\Exception $exception) {
            return $this->error($exception);
        }
    }

    public function refresh(Request $request)
    {
        try {
            $refreshToken = $request->cookie('refresh_token');
            $oClient = OClient::whereJsonContains('grant_types', ['password'])->first();
            $params = [
                'grant_type' => 'refresh_token',
                'refresh_token' => $refreshToken,
                'client_id' => $oClient->id,
                'client_secret' => env('PASSPORT_CLIENT_SECRET'),
                'scope' => '',
            ];

            $proxy = Request::create('/oauth/token', 'POST', $params);
            $proxy->headers->set('Accept', 'application/json');
            $response = app()->handle($proxy);
            $credentials = json_decode($response->getContent());
            Log::info(trans('messages.refresh'));
            if ($response->getStatusCode() == 200) {
                return $this->success([
                    'token' => [
                        'access_token' => $credentials->access_token,
                    ]
                ])->cookie(
                    'refresh_token',
                    $credentials->refresh_token, // new refresh token
                    60 * 24 * 7,
                    '/',
                    null,
                    false,
                    true,
                    false,
                    'lax'
                );
            } else {
                $hint = $credentials->hint ?? '';

                if (str_contains($hint, 'expired')) {
                    return new JsonResponse([
                        'error' => true,
                        'message' => $credentials->error ?? 'Token expired',
                        'data' => $credentials
                    ], 407);
                } else {
                    return new JsonResponse([
                        'error' => true,
                        'message' => $credentials->error ?? 'Invalid token',
                        'data' => $credentials
                    ], 410);
                }
            }
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
            return response()->json([
                'error' => true,
                'message' => $exception->getMessage()
            ], 400);
        }
    }

    public function logout()
    {
        try {
            $user = Auth::user();
            $token = $user->token();
            $refreshToken = RefreshToken::query()
                ->where('access_token_id', '=', $token->id)
                ->first();
            $token->revoke();
            $refreshToken->revoke();
            $user->update([
                'device_token' => null,
                'last_log_out' => new \DateTime()
            ]);
            Log::info(trans('messages.logged_out'));
            return $this->success("", 'Successfully logged out');
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
            return response()->json([
                'error' => true,
                'message' => $exception->getMessage()
            ], 400);
        }
    }

    public function resetPasswordEmail($request) {
        try {
            if (!$request->hasValidSignature()) {
                return $this->error("Invalid signature, please resend confirmation email", 403);
            }

            $user = User::find($request->route('id'));

            if (!$user) {
                return $this->error('User not found', 404);
            }

            // check if already used
            $tokenExists = DB::table('password_reset_tokens')
                ->where('email', $user->email)
                ->exists();

            if (!$tokenExists) {
                return $this->error('This reset link has already been used', 403);
            }

            $password = $request->get('password');
            $password_confirm = $request->get('password_confirm');

            if ($password !== $password_confirm) {
                return $this->responseToJsonError('Passwords do not match', 422);
            }

            $user = User::find($request->route('id'));

            $hashPassword = Hash::make($password);
            $user->password = $hashPassword;
            DB::table('password_reset_tokens')->where('email', $user->email)->delete();
            // mark as used

            $user->save();

            $user->tokens()->each(function ($token) {
                RefreshToken::where('access_token_id', $token->id)->each(fn($rt) => $rt->revoke());
                $token->revoke();
            });


            return $this->responseToJsonSuccess(null, "Password set successfully please log back in!");
        }
        catch (\Exception $th) {
            return $this->error($th->getMessage(), 500);
        }
    }

    public function resendPasswordResetEmailLink($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return $this->error('No user found with id: ' . $id, 404);
            }

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                ['token' => Str::random(64), 'created_at' => now()]
            );
            $user->notify(new SetUserPasswordNotification());

            return $this->responseToJsonSuccess(null, "Reset password link has been sent to your email!");
        }
        catch (\Exception $th) {
            return $this->error($th->getMessage(), 500);
        }
    }

    public function forgotPasswordEmail($request) {
        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return $this->responseToJsonSuccess(null, "If that email exists, a reset link has been sent");
            }

            $user->notify(new SetUserPasswordNotification());

            return $this->responseToJsonSuccess(null, "If that email exists, a reset link has been sent");
        }
        catch (\Exception $th) {
            return $this->error($th->getMessage(), 500);
        }
    }
}





