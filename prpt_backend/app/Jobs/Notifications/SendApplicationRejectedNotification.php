<?php

namespace App\Jobs\Notifications;

use App\Models\RentalApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendApplicationRejectedNotification implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public RentalApplication $application)
    {
    }

    public function handle(): void
    {
        $this->application->loadMissing(['user', 'unit.property']);

        $applicant = $this->application->user;

        if (! $applicant?->email) {
            return;
        }

        Mail::send('emails.application-rejected', [
            'applicant_name' => $applicant->first_name,
            'property_name' => $this->application->unit?->property?->name,
            'unit_number' => $this->application->unit?->unit_number,
            'rejection_reason' => $this->application->rejection_reason,
        ], function ($message) use ($applicant) {
            $message->to($applicant->email)
                ->subject('Rental Application Update');
        });
    }
}
