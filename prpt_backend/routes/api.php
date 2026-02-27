<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\Property\PropertyController;
use App\Http\Controllers\Unit\UnitController;
use App\Http\Controllers\Lease\LeaseController;

// auth Login
Route::middleware('throttle:login')->post('/login', [AuthController ::class, 'login'])->name('login');
Route::middleware('throttle:forgotPassword')->post('/forgotPassword', [AuthController::class, 'forgotPassword'])->name('forgotPassword');
Route::middleware('throttle:resetPassword')->post('/resetPassword', [AuthController::class, 'resetPassword'])->name('resetPassword');
Route::middleware('throttle:checkCode')->post('/checkCode', [AuthController::class, 'checkCode'])->name('checkCode');
Route::get('/confirm-email/{id}', [AuthController::class, 'verify'])->name('confirmemail.verify');
Route::post('/reset-password-email/{id}', [AuthController::class, 'resetPasswordEmail'])->middleware(['signed'])->name('password.temp.reset');
// Create Company
Route::post('/register-company', [CompanyController::class, 'createCompany'])->name('create.company');

// Get user state on init
Route::middleware('auth:api')->get('user-state', [UserController::class, 'user_state']);

Route::middleware(['auth:api', 'company.scope'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    // User management
    Route::middleware('throttle:userManagement')->group(function () {
        Route::get('users', [UserController::class, 'getUsers'])->middleware('can:view-users');
        Route::get('users/team-members', [UserController::class, 'getTeamMembers'])->middleware('can:view-users');
        Route::get('users/residents', [UserController::class, 'getResidents'])->middleware('can:view-users');
        Route::get('users/{user}', [UserController::class, 'getUser'])->middleware(['can:view-users', 'can:view,user']);
        Route::post('users', [UserController::class, 'createUser'])->middleware('can:invite-users');
        Route::put('users/{user}', [UserController::class, 'editUser'])->middleware(['can:manage-users', 'can:update,user']);
        Route::delete('users/{user}', [UserController::class, 'deleteUser'])->middleware(['can:manage-users', 'can:delete,user']);
    });

    // Company
    Route::prefix('company')->group(function () {});

    // Property management
    Route::prefix('property')->middleware('throttle:propertyManagement')->group(function () {
        Route::get('', [PropertyController::class, 'getProperties'])->middleware('can:view-properties');
        Route::get('/{property}', [PropertyController::class, 'getProperty'])->middleware(['can:view-properties', 'can:view,property']);
        Route::post('', [PropertyController::class, 'createProperty'])->middleware('can:create-properties');
        Route::put('/{property}', [PropertyController::class, 'editProperty'])->middleware('can:edit-properties, can:update,property');
        Route::delete('/{property}', [PropertyController::class, 'deleteProperty'])->middleware('can:delete-properties, can:delete,property');
    });

    // Unit management
    Route::prefix('unit')->middleware('throttle:unitManagement')->group(function () {
        Route::get('', [UnitController::class, 'getUnits'])->middleware('can:view-units');
        Route::get('/{unit}', [UnitController::class, 'getUnit'])->middleware(['can:view-units', 'can:view,unit']);
        Route::post('', [UnitController::class, 'createUnit'])->middleware('can:create-units');
        Route::put('/{unit}', [UnitController::class, 'editUnit'])->middleware(['can:edit-units', 'can:update,unit']);
        Route::delete('/{unit}', [UnitController::class, 'deleteUnit'])->middleware(['can:delete-units', 'can:delete,unit']);
    });

    // Lease management
    Route::prefix('lease')->middleware('throttle:leaseManagement')->group(function () {
        Route::get('', [LeaseController::class, 'getLeases'])->middleware('can:view-leases');
        Route::get('/{lease}', [LeaseController::class, 'getLease'])->middleware(['can:view-leases', 'can:view,lease']);
        Route::post('', [LeaseController::class, 'createLease'])->middleware('can:create-leases');
        Route::put('/{lease}', [LeaseController::class, 'editLease'])->middleware(['can:edit-leases', ]);
        Route::delete('/{lease}', [LeaseController::class, 'deleteLease'])->middleware('can:delete-leases');
    });
});
