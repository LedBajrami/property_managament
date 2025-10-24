<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    protected function configureRateLimiting(): void
    {

        //auth
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });

        RateLimiter::for('forgotPassword', function (Request $request) {
            return Limit::perMinute(2)->by($request->ip());
        });

        RateLimiter::for('resetPassword', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        //user management
        RateLimiter::for('userManagement', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });

        //company management
        RateLimiter::for('companyManagement', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });

        //property management
        RateLimiter::for('propertyManagement', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });

        //unit management
        RateLimiter::for('unitManagement', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });

        //workType management
        RateLimiter::for('workTypeManagement', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });

        //leaveType management
        RateLimiter::for('leaveTypeManagement', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });

        //workArrangementType management
        RateLimiter::for('workArrangementTypeManagement', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });

        //view profile
        RateLimiter::for('viewProfile', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });

        //request leave
        RateLimiter::for('requestLeave', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });

        //work arrangement request
        RateLimiter::for('workArrangementRequest', function (Request $request) {
            return Limit::perMinute(250)->by($request->ip());
        });
    }
}
