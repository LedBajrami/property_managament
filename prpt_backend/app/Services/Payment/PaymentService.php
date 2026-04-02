<?php

namespace App\Services\Payment;

// app/Services/Payment/PaymentService.php

namespace App\Services\Payment;

use App\Models\Document;
use App\Models\PaymentSchedule;
use App\Models\PaymentTransaction;
use App\Traits\ApiTrait;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Psy\Util\Str;

class PaymentService implements PaymentServiceInterface
{
    use ApiTrait;

    public function recordPayment(PaymentSchedule $schedule, $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Create payment transaction
            $transaction = PaymentTransaction::create([
                'payment_schedule_id' => $schedule->id,
                'amount_paid' => $data['amount_paid'],
                'payment_date' => $data['payment_date'] ?? now(),
                'payment_method' => $data['payment_method'],
                'transaction_id' => $data['transaction_id'] ?? null,
                'status' => 'success',
            ]);

            // Calculate total paid
            $totalPaid = $schedule->transactions()->sum('amount_paid');
            $totalDue = $schedule->amount + ($schedule->late_fee ?? 0);

            // Update schedule status if fully paid
            if ($totalPaid >= $totalDue) {
                $schedule->update(['status' => 'paid']);
            }

            $receipt = $this->generateReceipt($transaction);
            $transaction->update(['receipt_document_id' => $receipt->id]);

            // TODO: Generate receipt
            // TODO: Send confirmation email

            DB::commit();

            return $this->success($transaction, 'Payment recorded successfully');

        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    public function getTransactions(PaymentSchedule $schedule)
    {
        try {
            $transactions = $schedule->transactions()->latest()->get();
            return $this->success($transactions);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    private function generateReceipt(PaymentTransaction $transaction)
    {
        $schedule = $transaction->paymentSchedule;
        $lease = $schedule->lease;
        $resident = $lease->resident;
        $company = $lease->company;

        // Generate PDF
        $pdf = Pdf::loadView('receipts.payment-receipt', [
            'transaction' => $transaction,
            'schedule' => $schedule,
            'lease' => $lease,
            'resident' => $resident,
            'company' => $company,
            'receipt_number' => 'RCP-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT),
        ]);

        // Generate unique filename
        $hash = Str::random(40);
        $filename = $hash . '.pdf';

        // Save to storage
        $path = 'receipts/' . $filename;
        Storage::disk('documents')->put($path, $pdf->output());

        // Create document record
        $document = Document::create([
            'company_id' => $company->id,
            'documentable_id' => $transaction->id,
            'documentable_type' => PaymentTransaction::class,
            'file_path' => $path,
            'file_hash' => $hash,
            'document_type' => 'payment_receipt',
            'original_name' => "Receipt-{$transaction->id}.pdf",
            'mime_type' => 'application/pdf',
            'file_size' => Storage::disk('documents')->size($path),
            'uploaded_by' => auth()->id(),
        ]);

        return $document;
    }
}
