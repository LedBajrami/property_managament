<?php

namespace App\Providers;

use App\Services\Auth\AuthServices;
use App\Services\Auth\AuthServicesInterface;
use App\Services\Company\CompanyService;
use App\Services\Company\CompanyServiceInterface;
use App\Services\Property\PropertyService;
use App\Services\Property\PropertyServiceInterface;
use App\Services\Unit\UnitService;
use App\Services\Unit\UnitServiceInterface;
use App\Services\Users\UserService;
use App\Services\Users\UserServiceInterface;
use Illuminate\Support\ServiceProvider;

class ApiServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(AuthServicesInterface::class,AuthServices::class);
        $this->app->bind(UserServiceInterface::class,UserService::class);
        $this->app->bind(CompanyServiceInterface::class,CompanyService::class);
        $this->app->bind(PropertyServiceInterface::class,PropertyService::class);
        $this->app->bind(UnitServiceInterface::class,UnitService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
