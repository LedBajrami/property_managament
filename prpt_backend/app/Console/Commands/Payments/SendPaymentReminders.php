<?php

namespace App\Console\Commands\Payments;

use App\Jobs\Notifications\SendPaymentReminderNotification;
use App\Models\PaymentSchedule;
use Illuminate\Console\Command;

class SendPaymentReminders extends Command
{
    protected $signature = 'payments:send-reminders';
    protected $description = 'Send payment reminders 3 days before due date';

    public function handle()
    {
        $reminderDate = now()->addDays(3)->startOfDay();

        $upcomingPayments = PaymentSchedule::where('status', 'pending')
            ->whereDate('due_date', $reminderDate->format('Y-m-d'))
            ->get();

        foreach ($upcomingPayments as $payment) {
            dispatch(new SendPaymentReminderNotification($payment));
        }

        $this->info("Sent {$upcomingPayments->count()} payment reminders");
    }
}
