<?php

namespace App\Services\Deposit;

use App\Models\Lease;
use App\Http\Requests\Deposit\RecordDepositPaidRequest;
use App\Http\Requests\Deposit\RecordDepositReturnRequest;

interface DepositServiceInterface
{
    public function getDepositSummary(Lease $lease);
    public function recordPaid(Lease $lease, RecordDepositPaidRequest $request);
    public function recordReturn(Lease $lease, RecordDepositReturnRequest $request);
}
