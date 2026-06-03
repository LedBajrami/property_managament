<?php

namespace App\Services\Application;

use App\Http\Requests\Application\ApproveApplicationRequest;
use App\Http\Requests\Application\RejectApplicationRequest;
use App\Models\RentalApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

interface ApplicationServiceInterface
{
    public function getApplications(Request $request): JsonResponse;
    public function getApplication(RentalApplication $application): JsonResponse;
    public function approve(RentalApplication $application, ApproveApplicationRequest $request): JsonResponse;
    public function reject(RentalApplication $application, RejectApplicationRequest $request): JsonResponse;
}
