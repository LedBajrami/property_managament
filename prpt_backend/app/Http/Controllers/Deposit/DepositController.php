<?php

namespace App\Http\Controllers\Deposit;

use App\Http\Controllers\Controller;
use App\Http\Requests\Deposit\RecordDepositPaidRequest;
use App\Http\Requests\Deposit\RecordDepositReturnRequest;
use App\Models\Lease;
use App\Services\Deposit\DepositServiceInterface;

class DepositController extends Controller
{
    protected $depositService;

    public function __construct(DepositServiceInterface $depositService)
    {
        $this->depositService = $depositService;
    }

    public function getSummary(Lease $lease)
    {
        return $this->depositService->getDepositSummary($lease);
    }

    public function recordPaid(Lease $lease, RecordDepositPaidRequest $request)
    {
        return $this->depositService->recordPaid($lease, $request);
    }

    public function recordReturn(Lease $lease, RecordDepositReturnRequest $request)
    {
        return $this->depositService->recordReturn($lease, $request);
    }
}
