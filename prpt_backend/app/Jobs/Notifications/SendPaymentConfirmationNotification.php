<?php

namespace App\Jobs\Notifications;

use App\Models\PaymentTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class SendPaymentConfirmationNotification implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public PaymentTransaction $transaction;

    public function __construct(PaymentTransaction $transaction)
    {
        $this->transaction = $transaction;
    }

    public function handle(): void
    {
        $this->transaction->load([
            'receipt',
            'paymentSchedule.lease.resident',
            'paymentSchedule.lease.unit',
        ]);

        $schedule = $this->transaction->paymentSchedule;
        $lease = $schedule->lease;
        $resident = $lease->resident;
        $document = $this->transaction->receipt;

        if (! $resident?->email || ! $document) {
            return;
        }

        $receiptNumber = 'RCP-' . str_pad($this->transaction->id, 6, '0', STR_PAD_LEFT);

        Mail::send('emails.payment-confirmation', [
            'resident_name' => $resident->first_name,
            'amount_paid' => $this->transaction->amount_paid,
            'payment_date' => $this->transaction->payment_date,
            'payment_method' => $this->transaction->payment_method,
            'unit_number' => $lease->unit->unit_number,
            'receipt_number' => $receiptNumber,
        ], function ($message) use ($resident, $document) {
            $message->to($resident->email)
                ->subject('Payment Confirmation – Receipt Attached');

            if (Storage::disk('documents')->exists($document->file_path)) {
                $message->attachData(
                    Storage::disk('documents')->get($document->file_path),
                    $document->original_name ?? 'receipt.pdf',
                    ['mime' => $document->mime_type ?? 'application/pdf']
                );
            }
        });
    }
}
