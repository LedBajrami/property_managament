<?php

namespace App\Services\Lease;

use App\Http\Requests\Lease\CreateLeaseRequest;
use App\Models\Lease;
use Illuminate\Http\Request;

interface LeaseServiceInterface
{
    public function getLeases(Request $request);

    public function getLease(Lease $lease);

    public function createLease(CreateLeaseRequest $request);

    public function editLease(Lease $lease, CreateLeaseRequest $request);

    public function deleteLease(Lease $lease);
}
