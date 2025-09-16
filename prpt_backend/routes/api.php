<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;

// auth Login
Route::middleware('throttle:login')->post('/login', [AuthController::class, 'login'])->name('login');
Route::middleware('throttle:forgotPassword')->post('/forgotPassword', [AuthController::class, 'forgotPassword'])->name('forgotPassword');
Route::middleware('throttle:resetPassword')->post('/resetPassword', [AuthController::class, 'resetPassword'])->name('resetPassword');
Route::middleware('throttle:checkCode')->post('/checkCode', [AuthController::class, 'checkCode'])->name('checkCode');
Route::get('/confirm-email/{id}', [AuthController::class, 'verify'])->name('confirmemail.verify');
Route::post('/reset-password-email/{id}', [AuthController::class, 'resetPasswordEmail'])->name('passwordtemp.reset');


Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user-state', [UserController::class, 'user_state']);
});
