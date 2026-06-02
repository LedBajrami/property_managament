<?php

namespace App\Services\Public\Resident\Applications;

use App\Http\Requests\Public\StoreApplicationRequest;
use Illuminate\Http\JsonResponse;

interface PublicApplicationServiceInterface
{
    public function store(StoreApplicationRequest $request): JsonResponse;
    public function mine(): JsonResponse;
}
