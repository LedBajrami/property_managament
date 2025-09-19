<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Company\CompanyController;

// auth Login
Route::middleware('throttle:login')->post('/login', [AuthController ::class, 'login'])->name('login');
Route::middleware('throttle:forgotPassword')->post('/forgotPassword', [AuthController::class, 'forgotPassword'])->name('forgotPassword');
Route::middleware('throttle:resetPassword')->post('/resetPassword', [AuthController::class, 'resetPassword'])->name('resetPassword');
Route::middleware('throttle:checkCode')->post('/checkCode', [AuthController::class, 'checkCode'])->name('checkCode');
Route::get('/confirm-email/{id}', [AuthController::class, 'verify'])->name('confirmemail.verify');
Route::post('/reset-password-email/{id}', [AuthController::class, 'resetPasswordEmail'])->name('password.temp.reset');
// Create Company
Route::post('/register-company', [CompanyController::class, 'createCompany'])->name('create.company');

Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user-state', [UserController::class, 'user_state']);

    // User management
    Route::middleware('throttle:userManagement')->group(function () {
        Route::get('users', [UserController::class, 'getUsers']);
        Route::get('users/{user}', [UserController::class, 'getUser']);
        Route::post('users', [UserController::class, 'createUser']);
        Route::put('users/{user}', [UserController::class, 'editUser']);
        Route::delete('users/{user}', [UserController::class, 'deleteUser']);
    });

    // Company
    Route::prefix('company')->group(function () {});
});
