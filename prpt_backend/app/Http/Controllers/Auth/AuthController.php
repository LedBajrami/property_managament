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

    public function refresh(ApiRefreshTokenRequest $request){
        return $this->authServices->refresh($request);
    }

    public function forgotPassword(ForgotPasswordRequest $request){
        return $this->authServices->forgotPassword($request);
    }

    public function resetPassword(ResetPasswordRequest $request){
        return $this->authServices->resetPassword($request);
    }

    public function checkCode(CheckPasswordOtpRequest $request){
        return $this->authServices->checkCode($request);
    }

    public function userState(){
        return $this->authServices->userState();
    }

    public function changePassword(PasswordUpdateRequest $request){
        return $this->authServices->changePassword($request);
    }

    public function verify(Request $request, $id)
    {
        return $this->authServices->verify($request, $id);
    }

    public function resetPasswordEmail(Request $request)
    {
        return $this->authServices->resetPasswordEmail($request);
    }
}
