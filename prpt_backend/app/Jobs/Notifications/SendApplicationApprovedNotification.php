<?php

namespace App\Jobs\Notifications;

use App\Models\Lease;
use App\Models\RentalApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendApplicationApprovedNotification implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public RentalApplication $application,
        public Lease $lease
    ) {
    }

    public function handle(): void
    {
        $this->application->loadMissing(['user', 'unit.property']);
        $this->lease->loadMissing('unit');

        $applicant = $this->application->user;

        if (! $applicant?->email) {
            return;
        }

        Mail::send('emails.application-approved', [
            'applicant_name' => $applicant->first_name,
            'property_name' => $this->application->unit?->property?->name,
            'unit_number' => $this->application->unit?->unit_number,
            'lease_start_date' => $this->lease->start_date,
            'lease_end_date' => $this->lease->end_date,
        ], function ($message) use ($applicant) {
            $message->to($applicant->email)
                ->subject('Rental Application Approved');
        });
    }
}
