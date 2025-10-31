<?php

namespace App\Http\Controllers\Lease;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lease\CreateLeaseRequest;
use App\Models\Lease;
use App\Services\Lease\LeaseServiceInterface;
use Illuminate\Http\Request;

class LeaseController extends Controller
{
    protected $leaseService;

    public function __construct(LeaseServiceInterface $leaseService) {
        $this->leaseService = $leaseService;
    }

    public function getLeases(Request $request) {
        return $this->leaseService->getLeases($request);
    }

    public function getLease(Lease $lease) {
        return $this->leaseService->getLease($lease);
    }

    public function createLease(CreateLeaseRequest $request) {
        return $this->leaseService->createLease($request);
    }

    public function editLease(Lease $lease, CreateLeaseRequest $request) {
        return $this->leaseService->editLease($lease, $request);
    }

    public function deleteLease(Lease $lease) {
        return $this->leaseService->deleteLease($lease);
    }
}
