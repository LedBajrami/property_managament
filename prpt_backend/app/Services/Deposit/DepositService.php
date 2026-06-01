<?php

namespace App\Services\Deposit;

use App\Http\Requests\Deposit\RecordDepositPaidRequest;
use App\Http\Requests\Deposit\RecordDepositReturnRequest;
use App\Http\Resources\Deposit\DepositTransactionResource;
use App\Models\DepositTransaction;
use App\Models\Lease;
use App\Traits\ApiTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DepositService implements DepositServiceInterface
{
    use ApiTrait;

    public function getDepositSummary(Lease $lease)
    {
        try {
            $transactions = $lease->depositTransactions()->with('processedBy')->latest()->get();

            $totalPaid     = $transactions->where('type', 'paid')->sum('amount');
            $totalReturned = $transactions->where('type', 'returned')->sum('amount');

            return $this->success([
                'deposit_amount'   => $lease->deposit_amount,
                'total_paid'       => $totalPaid,
                'total_returned'   => $totalReturned,
                'balance'          => $totalPaid - $totalReturned,
                'is_paid'          => $totalPaid >= $lease->deposit_amount,
                'is_returned'      => $totalReturned >= $totalPaid,
                'transactions'     => DepositTransactionResource::collection($transactions),
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function recordPaid(Lease $lease, RecordDepositPaidRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            $alreadyPaid = $lease->depositTransactions()
                ->where('type', 'paid')
                ->sum('amount');

            $remaining = $lease->deposit_amount - $alreadyPaid;

            if ($remaining <= 0) {
                return $this->error('Deposit has already been paid in full');
            }

            if ($data['amount'] > $remaining) {
                return $this->error("Amount exceeds remaining deposit balance of $remaining");
            }

            $transaction = DepositTransaction::create([
                ...$data,
                'lease_id'     => $lease->id,
                'type'         => 'paid',
                'processed_by' => Auth::id(),
            ]);

            // Update shorthand flag on lease
            $newTotal = $alreadyPaid + $data['amount'];
            if ($newTotal >= $lease->deposit_amount) {
                $lease->update([
                    'deposit_paid'      => true,
                    'deposit_paid_date' => $data['transaction_date'],
                ]);
            }

            DB::commit();

            return $this->success(
                new DepositTransactionResource($transaction->load('processedBy')),
                'Deposit payment recorded successfully'
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    public function recordReturn(Lease $lease, RecordDepositReturnRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            $totalPaid     = $lease->depositTransactions()->where('type', 'paid')->sum('amount');
            $totalReturned = $lease->depositTransactions()->where('type', 'returned')->sum('amount');
            $returnable    = $totalPaid - $totalReturned;

            if ($totalPaid <= 0) {
                return $this->error('No deposit payment has been recorded yet');
            }

            if ($returnable <= 0) {
                return $this->error('Deposit has already been returned in full');
            }

            if ($data['amount'] > $returnable) {
                return $this->error("Amount exceeds returnable balance of $returnable");
            }

            $transaction = DepositTransaction::create([
                ...$data,
                'lease_id'     => $lease->id,
                'type'         => 'returned',
                'processed_by' => Auth::id(),
            ]);

            $newReturned = $totalReturned + $data['amount'];
            if ($newReturned >= $totalPaid) {
                $lease->update([
                    'deposit_returned'      => true,
                    'deposit_returned_date' => $data['transaction_date'],
                ]);
            }

            DB::commit();

            return $this->success(
                new DepositTransactionResource($transaction->load('processedBy')),
                'Deposit return recorded successfully'
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }
}
