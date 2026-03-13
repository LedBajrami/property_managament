<?php

namespace App\Jobs\Notifications;

use App\Models\PaymentSchedule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendOverduePaymentNotification implements ShouldQueue
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

        Mail::send('emails.overdue-payment', [
            'resident_name' => $resident->first_name,
            'amount' => $this->paymentSchedule->amount,
            'late_fee' => $this->paymentSchedule->late_fee,
            'due_date' => $this->paymentSchedule->due_date,
            'unit_number' => $lease->unit->unit_number,
        ], function ($message) use ($resident) {
            $message->to($resident->email)
                ->subject('Overdue Payment Notice');
        });
    }
}
