<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\ApproveApplicationRequest;
use App\Http\Requests\Application\RejectApplicationRequest;
use App\Models\RentalApplication;
use App\Services\Application\ApplicationServiceInterface;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    protected ApplicationServiceInterface $applicationService;

    public function __construct(ApplicationServiceInterface $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    public function getApplications(Request $request)
    {
        return $this->applicationService->getApplications($request);
    }

    public function getApplication(RentalApplication $application)
    {
        return $this->applicationService->getApplication($application);
    }

    public function approve(RentalApplication $application, ApproveApplicationRequest $request)
    {
        return $this->applicationService->approve($application, $request);
    }

    public function reject(RentalApplication $application, RejectApplicationRequest $request)
    {
        return $this->applicationService->reject($application, $request);
    }
}
