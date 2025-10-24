<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\Property\PropertyController;
use App\Http\Controllers\Unit\UnitController;

// auth Login
Route::middleware('throttle:login')->post('/login', [AuthController ::class, 'login'])->name('login');
Route::middleware('throttle:forgotPassword')->post('/forgotPassword', [AuthController::class, 'forgotPassword'])->name('forgotPassword');
Route::middleware('throttle:resetPassword')->post('/resetPassword', [AuthController::class, 'resetPassword'])->name('resetPassword');
Route::middleware('throttle:checkCode')->post('/checkCode', [AuthController::class, 'checkCode'])->name('checkCode');
Route::get('/confirm-email/{id}', [AuthController::class, 'verify'])->name('confirmemail.verify');
Route::post('/reset-password-email/{id}', [AuthController::class, 'resetPasswordEmail'])->middleware(['signed'])->name('password.temp.reset');
// Create Company
Route::post('/register-company', [CompanyController::class, 'createCompany'])->name('create.company');

Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user-state', [UserController::class, 'user_state']);

    // User management
    Route::middleware('throttle:userManagement')->group(function () {
        Route::get('users', [UserController::class, 'getUsers']);
        Route::get('users/team-members', [UserController::class, 'getTeamMembers']);
        Route::get('users/residents', [UserController::class, 'getResidents']);
        Route::get('users/{user}', [UserController::class, 'getUser']);
        Route::post('users', [UserController::class, 'createUser']);
        Route::put('users/{user}', [UserController::class, 'editUser']);
        Route::delete('users/{user}', [UserController::class, 'deleteUser']);
    });

    // Company
    Route::prefix('company')->group(function () {});

    // Property management
    Route::prefix('property')->middleware('throttle:propertyManagement')->group(function () {
        Route::get('', [PropertyController::class, 'getProperties']);
        Route::get('/{property}', [PropertyController::class, 'getProperty']);
        Route::post('', [PropertyController::class, 'createProperty']);
        Route::put('/{property}', [PropertyController::class, 'editProperty']);
        Route::delete('/{property}', [PropertyController::class, 'deleteProperty']);
    });

    // Unit management
    Route::prefix('unit')->middleware('throttle:unitManagement')->group(function () {
        Route::get('', [UnitController::class, 'getUnits']);
        Route::get('/{unit}', [UnitController::class, 'getUnit']);
        Route::post('', [UnitController::class, 'createUnit']);
        Route::put('/{unit}', [UnitController::class, 'editUnit']);
        Route::delete('/{unit}', [UnitController::class, 'deleteUnit']);
    });
});
