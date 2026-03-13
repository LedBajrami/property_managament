<?php

namespace App\Console\Commands\Lease;

use App\Jobs\Notifications\SendLeaseRenewalReminder;
use App\Models\Lease;
use Illuminate\Console\Command;

class UpdateLeaseStatuses extends Command
{
    protected $signature = 'leases:update-statuses';
    protected $description = 'Mark expired leases and send renewal reminders';

    public function handle()
    {
        $today = now()->startOfDay();

        // Mark expired leases
        $expiredLeases = Lease::where('status', 'active')
            ->whereDate('end_date', '<', $today)
            ->get();

        foreach ($expiredLeases as $lease) {
            $lease->update(['status' => 'expired']);
            $lease->unit->update(['status' => 'available']);

            $this->info("Lease #{$lease->id} marked as expired");
        }

        // Send renewal reminders (60 days before expiry)
        $renewalReminderDate = $today->copy()->addDays(60);

        $upcomingExpiries = Lease::where('status', 'active')
            ->whereDate('end_date', '=', $renewalReminderDate)
            ->get();

        foreach ($upcomingExpiries as $lease) {
            dispatch(new SendLeaseRenewalReminder($lease));
        }

        $this->info("Sent {$upcomingExpiries->count()} renewal reminders");
    }
}
