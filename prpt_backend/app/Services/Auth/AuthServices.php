<?php

namespace App\Services\Auth;

use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\CheckPasswordOtpRequest;
use App\Http\Requests\Auth\PasswordUpdateRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ApiRefreshTokenRequest;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Traits\ApiTrait;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
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
                    'client_secret' => env('PASSPORT_CLIENT_SECRET'), // hashed in database by default, so use .env to store it in plain text
                    'username' => request('email'),
                    'password' => request('password'),
                    'scope' => '*',
                ];

                $proxy = Request::create('/oauth/token', 'POST', $params);
                $proxy->headers->set('Accept', 'application/json');
                $response = app()->handle($proxy);
                $credentials = json_decode($response->getContent(), true);
                $user = Auth::guard('web')->user();
//                $user->update([
//                    'device_token' => $request->request->get('device_token')
//                ]);

                //$permission = $this->configRepository->getPermissionList($user->id);

                return $this->successLoginResponse($user, $credentials);
            } else {
                return $this->unauthorized();
            }
        } catch (\Exception $exception) {
            return $this->error($exception);
        }
    }

    public function refresh(ApiRefreshTokenRequest $request)
    {
        try {
            $refreshToken = request('refresh_token');
            $oClient = OClient::where('password_client', 1)->first();
            $params = [
                'grant_type' => 'refresh_token',
                'refresh_token' => $refreshToken,
                'client_id' => $oClient->id,
                'client_secret' => $oClient->secret,
                'scope' => '',
            ];

            $proxy = Request::create('/oauth/token', 'POST', $params);
            $proxy->headers->set('Accept', 'application/json');
            $response = app()->handle($proxy);
            $credentials = json_decode($response->content());
            Log::info(trans('messages.refresh'));
            if ($response->getStatusCode() == 200) {
                return response()->json($credentials, 200);
            } else {
                if (str_contains($credentials->hint, 'expired')) {
                    return new JsonResponse([
                        'error' => true,
                        'message' => $credentials->error,
                        'data' => $credentials
                    ], 407);
                } else {
                    return new JsonResponse([
                        'error' => true,
                        'message' => $credentials->error,
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

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        try {
            $email = $request->input('email');
            $user = User::where('email', $email)->first();
            if (!$user) {
                Log::info(trans('messages.forgot_pass_invalid_email'));
                return response()->json([
                    'error' => true,
                    'message' => trans('passwords.user')
                ], 400);
            }
            $otp = $this->generateOtp();
            $user->update([
                'otp' => $otp,
                'otp_created_at' => new \DateTime()
            ]);

            $subject="messages.reset_pass";
            $message = $otp;
            Mail::html($message, function( $message ) use ($email, $subject) {
                $message->subject($subject)
                    ->to($email);
            });
            Log::info(trans('messages.forgot_pass_email_sent'));
            return response()->json([
                'error' => false,
                'message' => trans('messages.forgot_pass_email_sent')
            ]);
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
            return response()->json([
                'error' => true,
                'message' => $exception->getMessage()
            ], 400);
        }
    }

    public function generateOtp(){
        return mt_rand(100000, 999999);
    }

    public function generateToken(){
        return Str::random(16);
    }

    public function generateOtpToken(){
        return Str::random(16);
    }

    public function checkCode(CheckPasswordOtpRequest $request){
        try {
            $otp = $request->input('otp');
            $user = User::where(['otp' => $otp, 'email' => $request->input('email')])->first();

            if (!$user) {
                Log::info(trans('messages.invalid_otp'));
                return response()->json([
                    'error' => true,
                    'message' => trans('messages.invalid_otp')
                ], 400);
            }
            $now = new \DateTime();
            $otpDate = new \DateTime($user->otp_created_at);
            $diff = $now->diff($otpDate);
            $minute = $diff->i;

            if ($minute > 5) {
                Log::info(trans('messages.expired_otp'));
                return response()->json([
                    'error' => true,
                    'message' => trans('messages.expired_otp')
                ], 400);
            }
            $otpToken = $this->generateOtpToken();
            $user->update([
                'otp' => $otpToken,
                'otp_created_at' => new \DateTime(),
            ]);
            Log::info(trans('messages.otp_verified'));
            return response()->json([
                'error' => false,
                'message' => trans('messages.success'),
                'data' => [
                    'otp_token' => $otpToken
                ]
            ]);
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
            return response()->json([
                'error' => true,
                'message' => $exception->getMessage()
            ], 400);
        }
    }

    public function resetPassword(ResetPasswordRequest $request){
        try {
            $user = User::where(['otp' => $request->input('otp'), 'email' => $request->input('email')])->first();
            if (!$user) {
                Log::info(trans('messages.invalid_otp'));
                return response()->json([
                    'error' => true,
                    'message' => trans('messages.invalid_otp')
                ], 400);
            }
            $now = new \DateTime();
            $otpDate = new \DateTime($user->otp_created_at);
            if ($now->diff($otpDate)->format('%i') > 5) {
                Log::info(trans('messages.expired_otp'));
                return response()->json([
                    'error' => true,
                    'message' => trans('messages.expired_otp')
                ], 400);
            }

            $user->update([
                'otp' => null,
                'otp_created_at' => null,
                'password' => bcrypt($request->input('new_password'))
            ]);
            Log::info(trans('messages.password_reset'));
            return response()->json([
                'error' => false,
                'message' => trans('messages.success')
            ]);
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

    public function userState()
    {
        try {
            $user = Auth::user();
            $userResource = new UserResource($user);
            return $this->success('SUCCESS',  ['user' => $userResource]);
        } catch (\Exception $exception) {
            return $this->error($exception);
        }
    }

    public function changePassword(PasswordUpdateRequest $request)
    {
        try {
           $user = Auth::user();
           $newPassword = Hash::make($request->get('password'));
           $user->update(['password' => $newPassword]);
           $userResource = new UserResource($user);
           return $this->success('SUCCESS', $userResource);
        } catch (\Exception $exception) {
            return $this->error($exception);
        }
    }

    public function verify(Request $request, $id)
    {
        try {
            if (!$request->hasValidSignature()) {
                return $this->error("Invalid signature, please resend confirmation email.", 403);
            }

            $user = User::find($request->route('id'));
            if ($user == null) {
                return $this->responseToJsonError("Error during data verification.", 104);
            }

            if (!hash_equals((string)$request->input('hash'), sha1($user->getEmailForVerification()))) {
                return $this->responseToJsonError("Error during data verification.", 104);
            }

            if ($user->email_verified_at != null) {
                return $this->responseToJsonSuccess('Email already confirmed.');
            }

            if ($user->markEmailAsVerified())
                event(new Verified($user));

            // email confirmed successfully, generate token for reset password
            $url = URL:: temporarySignedRoute(
                'passwordtemp.reset',
                Carbon::now()->addMinutes(2),
                [
                    'id' => $user->getKey(),
                    'hash' => sha1($user->getEmailForVerification()),
                ]
            );
            $ur = parse_url($url, -1);
            $newurlpath = str_replace("/api", "", $ur['path']);
            $newUrl = $newurlpath . '?' . $ur['query'];

            return $this->responseToJsonSuccess('Email confirmed successfully.', $newUrl);

        } catch (\Exception $ex) {

            return $this->error("Error, please retry.", 500, $ex);
        }
    }

    public function resetPasswordEmail(Request $request)
    {
        try
        {
            $password = $request->get('password');
            $password_confirm = $request->get('password_confirm');

            if ($password !== $password_confirm) {
                return $this->responseToJsonError('Passwords do not match!', 422);
            }

            $user = User::find($request->route('id'));

            $hashPassword = Hash::make($password);
            $user->password = $hashPassword;
            $user->email_verified_at = Carbon::now();

            $user->save();

            return $this->responseToJsonSuccess(" ", "Password changed successfully please log back in!");
        }
        catch (\Exception $th) {
            return $this->error($th->getMessage(), 500, $th);
        }
    }
}





