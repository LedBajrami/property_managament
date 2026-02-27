<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ApiRefreshTokenRequest;
use App\Http\Requests\Auth\CheckPasswordOtpRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\PasswordUpdateRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AuthServicesInterface;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * @var AuthServicesInterface
     */
    private $authServices;

    /**
     * @param AuthServicesInterface $authServices
     */
    public function __construct(AuthServicesInterface $authServices){
        $this->authServices = $authServices;
    }

    public function login(LoginRequest $request){
        return $this->authServices->login($request);
    }

    public function logout(){
        return $this->authServices->logout();
    }

    public function refresh(Request $request){
        return $this->authServices->refresh($request);
    }

    public function resetPasswordEmail(Request $request)
    {
        return $this->authServices->resetPasswordEmail($request);
    }

    public function resendPasswordResetEmailLink($id)
    {
        return $this->authServices->resendPasswordResetEmailLink($id);
    }
    public function forgotPasswordEmail(Request $request)
    {
        return $this->authServices->forgotPasswordEmail($request);
    }
}
