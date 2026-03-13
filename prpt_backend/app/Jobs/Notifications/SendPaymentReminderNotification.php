<?php

namespace App\Jobs\Notifications;

use App\Models\PaymentSchedule;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendPaymentReminderNotification implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public $paymentSchedule;

    public function __construct(PaymentSchedule $paymentSchedule)
    {
        $this->paymentSchedule = $paymentSchedule;
    }

    public function handle()
    {
        $lease = $this->paymentSchedule->lease;
        $resident = $lease->resident;

        // Simple email notification
        Mail::send('emails.payment-reminder', [
            'resident_name' => $resident->first_name,
            'amount' => $this->paymentSchedule->amount,
            'due_date' => $this->paymentSchedule->due_date,
            'unit_number' => $lease->unit->unit_number,
        ], function ($message) use ($resident) {
            $message->to($resident->email)
                ->subject('Rent Payment Reminder');
        });
    }
}
