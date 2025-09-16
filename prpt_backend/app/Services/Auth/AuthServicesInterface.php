<?php

namespace App\Services\Auth;

use App\Http\Requests\Auth\ApiRefreshTokenRequest;
use App\Http\Requests\Auth\CheckPasswordOtpRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\PasswordUpdateRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Http\Request;

interface AuthServicesInterface
{
    public function login(LoginRequest $request);

    public function refresh(ApiRefreshTokenRequest $request);

    public function logout();

    public function forgotPassword(ForgotPasswordRequest $request);

    public function generateOtp();

    public function generateToken();

    public function generateOtpToken();

    public function checkCode(CheckPasswordOtpRequest $request);

    public function resetPassword(ResetPasswordRequest $request);

    public function userState();

    public function changePassword(PasswordUpdateRequest $request);

    public function verify(Request $request, $id);

    public function resetPasswordEmail(Request $request);

}
