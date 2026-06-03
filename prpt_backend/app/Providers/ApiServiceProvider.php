<?php

namespace App\Providers;

use App\Services\Auth\AuthServices;
use App\Services\Auth\AuthServicesInterface;
use App\Services\Application\ApplicationService;
use App\Services\Application\ApplicationServiceInterface;
use App\Services\Company\CompanyService;
use App\Services\Company\CompanyServiceInterface;
use App\Services\Deposit\DepositService;
use App\Services\Deposit\DepositServiceInterface;
use App\Services\Lease\LeaseService;
use App\Services\Lease\LeaseServiceInterface;
use App\Services\Property\PropertyService;
use App\Services\Property\PropertyServiceInterface;
use App\Services\Public\Resident\Applications\PublicApplicationService;
use App\Services\Public\Resident\Applications\PublicApplicationServiceInterface;
use App\Services\Public\Resident\Properties\PublicPropertiesService;
use App\Services\Public\Resident\Properties\PublicPropertiesServiceInterface;
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
        $this->app->bind(LeaseServiceInterface::class,LeaseService::class);
        $this->app->bind(DepositServiceInterface::class, DepositService::class);
        $this->app->bind(ApplicationServiceInterface::class, ApplicationService::class);
        $this->app->bind(PublicPropertiesServiceInterface::class,PublicPropertiesService::class);
        $this->app->bind(PublicApplicationServiceInterface::class, PublicApplicationService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
