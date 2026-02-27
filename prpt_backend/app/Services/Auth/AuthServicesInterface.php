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

    public function refresh(Request $request);

    public function logout();

    public function forgotPasswordEmail($request);

    public function resetPasswordEmail(Request $request);

    public function resendPasswordResetEmailLink($id);

}
