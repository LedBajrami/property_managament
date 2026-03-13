<?php

namespace App\Console\Commands\Payments;

use App\Models\Lease;
use App\Models\PaymentSchedule;
use Illuminate\Console\Command;

class GenerateMonthlyPayments extends Command
{
    protected $signature = 'leases:generate-monthly-payments';
    protected $description = 'Generate next month payment for month-to-month leases';

    public function handle()
    {
        // Find all active month-to-month leases
        $monthToMonthLeases = Lease::where('status', 'active')
            ->where('lease_type', 'month-to-month')
            ->get();

        $generated = 0;

        foreach ($monthToMonthLeases as $lease) {
            // Check if payment for next month already exists
            $nextMonthDueDate = now()->addMonth()->day($lease->rent_due_day);

            $exists = PaymentSchedule::where('lease_id', $lease->id)
                ->whereDate('due_date', $nextMonthDueDate->format('Y-m-d'))
                ->exists();

            if (!$exists) {
                PaymentSchedule::create([
                    'lease_id' => $lease->id,
                    'due_date' => $nextMonthDueDate->format('Y-m-d'),
                    'amount' => $lease->monthly_rent,
                    'status' => 'pending',
                ]);

                $generated++;
            }
        }

        $this->info("Generated {$generated} monthly payments for month-to-month leases");
    }
}
