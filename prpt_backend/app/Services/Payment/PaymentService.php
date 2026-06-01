<?php

namespace App\Services\Payment;

use App\Http\Resources\Payment\PaymentScheduleResource;
use App\Jobs\Notifications\SendPaymentConfirmationNotification;
use App\Models\Document;
use App\Models\PaymentSchedule;
use App\Models\PaymentTransaction;
use App\Traits\ApiTrait;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PaymentService implements PaymentServiceInterface
{
    use ApiTrait;

    public function getPaymentSchedules(Request $request)
    {
        try {
            $company = app('current_company');
            $query = $this->baseScheduleQuery()
                ->whereHas('lease', fn ($q) => $q->where('company_id', $company->id));

            $this->applyScheduleFilters($query, $request);

            $schedules = $query->orderBy('due_date')->get();

            return $this->success(PaymentScheduleResource::collection($schedules));

        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function getMyPaymentSchedules(Request $request)
    {
        try {
            $company = app('current_company');

            $query = $this->baseScheduleQuery()
                ->whereHas('lease', function ($q) use ($company) {
                    $q->where('company_id', $company->id)
                        ->where('resident_id', auth()->id());
                });

            $this->applyScheduleFilters($query, $request);

            $schedules = $query->orderBy('due_date')->get();

            return $this->success(PaymentScheduleResource::collection($schedules));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function recordPayment(PaymentSchedule $schedule, $request)
    {
        $this->ensureScheduleInCompany($schedule);

        DB::beginTransaction();
        try {
            $data = $request->validated();

            $transaction = PaymentTransaction::create([
                'payment_schedule_id' => $schedule->id,
                'amount_paid' => $data['amount_paid'],
                'payment_date' => $data['payment_date'] ?? now(),
                'payment_method' => $data['payment_method'],
                'transaction_id' => $data['transaction_id'] ?? null,
                'status' => 'success',
            ]);

            $totalPaid = $schedule->transactions()->sum('amount_paid');
            $totalDue = $schedule->amount + ($schedule->late_fee ?? 0);

            if ($totalPaid >= $totalDue) {
                $schedule->update(['status' => 'paid']);
            }

            $receipt = $this->generateReceipt($transaction);

            $transaction->update(['receipt_document_id' => $receipt->id]);

            dispatch(new SendPaymentConfirmationNotification($transaction))->afterCommit();

            DB::commit();

            $transaction->load('receipt');

            return $this->success([
                'transaction' => $transaction,
                'receipt' => [
                    'id' => $receipt->id,
                    'original_name' => $receipt->original_name,
                ],
            ], 'Payment recorded successfully');

        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    public function getTransactions(PaymentSchedule $schedule)
    {
        try {
            $this->ensureScheduleInCompany($schedule);

            $transactions = $schedule->transactions()->with('receipt')->latest()->get();

            return $this->success($transactions);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    private function baseScheduleQuery()
    {
        return PaymentSchedule::with([
            'lease.resident',
            'lease.unit.property',
            'transactions.receipt',
        ]);
    }

    private function applyScheduleFilters($query, Request $request): void
    {
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('unit_id')) {
            $query->whereHas('lease', fn ($q) => $q->where('unit_id', $request->input('unit_id')));
        }

        if ($request->filled('lease_id')) {
            $query->where('lease_id', $request->input('lease_id'));
        }
    }

    private function ensureScheduleInCompany(PaymentSchedule $schedule): void
    {
        $company = app('current_company');
        $schedule->loadMissing('lease');

        if ($schedule->lease->company_id !== $company->id) {
            abort(403, 'Payment schedule does not belong to this company');
        }
    }

    private function generateReceipt(PaymentTransaction $transaction)
    {
        $schedule = $transaction->paymentSchedule()->with(['lease.resident', 'lease.unit', 'lease.company'])->first();
        $lease = $schedule->lease;
        $resident = $lease->resident;
        $company = $lease->company;

        $pdf = Pdf::loadView('receipts.payment-receipt', [
            'transaction' => $transaction,
            'schedule' => $schedule,
            'lease' => $lease,
            'resident' => $resident,
            'company' => $company,
            'receipt_number' => 'RCP-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT),
        ]);

        $hash = Str::random(40);
        $filename = $hash . '.pdf';
        $path = 'receipts/' . $filename;
        Storage::disk('documents')->put($path, $pdf->output());

        return Document::create([
            'company_id' => $company->id,
            'documentable_id' => $transaction->id,
            'documentable_type' => PaymentTransaction::class,
            'file_path' => $path,
            'document_type' => 'receipt',
            'original_name' => "Receipt-{$transaction->id}.pdf",
            'mime_type' => 'application/pdf',
            'file_size' => Storage::disk('documents')->size($path),
        ]);
    }
}
