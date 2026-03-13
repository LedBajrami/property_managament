<?php

namespace App\Http\Controllers\Lease;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lease\CreateLeaseRequest;
use App\Http\Requests\Lease\RenewLeaseRequest;
use App\Http\Requests\Lease\UpdateLeaseRequest;
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

    public function editLease(Lease $lease, UpdateLeaseRequest $request) {
        return $this->leaseService->editLease($lease, $request);
    }

    public function terminateLease(Lease $lease) {
        return $this->leaseService->terminateLease($lease);
    }

    public function renewLease($leaseId, RenewLeaseRequest $request) {
        return $this->leaseService->renewLease($leaseId, $request);
    }
}
