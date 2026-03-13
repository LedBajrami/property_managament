<?php

namespace App\Console\Commands\Payments;

use App\Jobs\Notifications\SendOverduePaymentNotification;
use App\Models\PaymentSchedule;
use Illuminate\Console\Command;

class UpdatePaymentStatuses extends Command
{
    protected $signature = 'payments:update-statuses';
    protected $description = 'Mark overdue payments and apply late fees';

    public function handle()
    {
        $today = now()->startOfDay();

        // Find payment schedules that are past due
        $overduePayments = PaymentSchedule::where('status', 'pending')
            ->whereDate('due_date', '<', $today)
            ->get();

        foreach ($overduePayments as $payment) {
            $daysPastDue = $today->diffInDays($payment->due_date);
            $lease = $payment->lease;

            // Apply late fee if past grace period
            if ($daysPastDue > $lease->late_fee_grace_days) {
                $payment->update([
                    'status' => 'overdue',
                    'late_fee' => $lease->late_fee_amount
                ]);

                // Send notification (via RabbitMQ)
                dispatch(new SendOverduePaymentNotification($payment));
            }
        }

        $this->info("Updated {$overduePayments->count()} overdue payments");
    }
}
