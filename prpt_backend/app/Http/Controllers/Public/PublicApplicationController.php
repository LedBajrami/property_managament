<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreApplicationRequest;
use App\Services\Public\Resident\Applications\PublicApplicationServiceInterface;

class PublicApplicationController extends Controller
{
    protected $publicApplicationService;

    public function __construct(PublicApplicationServiceInterface $publicApplicationService)
    {
        $this->publicApplicationService = $publicApplicationService;
    }

    public function store(StoreApplicationRequest $request)
    {
        return $this->publicApplicationService->store($request);
    }

    public function mine()
    {
        return $this->publicApplicationService->mine();
    }
}
