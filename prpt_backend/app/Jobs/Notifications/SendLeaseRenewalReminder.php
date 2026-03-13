<?php

namespace App\Jobs\Notifications;

use App\Models\Lease;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendLeaseRenewalReminder implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public $lease;

    public function __construct(Lease $lease)
    {
        $this->lease = $lease;
    }

    public function handle()
    {
        $resident = $this->lease->resident;
        $daysRemaining = now()->diffInDays($this->lease->end_date);

        Mail::send('emails.lease-renewal-reminder', [
            'resident_name' => $resident->first_name,
            'unit_number' => $this->lease->unit->unit_number,
            'end_date' => $this->lease->end_date,
            'days_remaining' => $daysRemaining,
        ], function ($message) use ($resident) {
            $message->to($resident->email)
                ->subject('Lease Renewal Reminder');
        });
    }
}
