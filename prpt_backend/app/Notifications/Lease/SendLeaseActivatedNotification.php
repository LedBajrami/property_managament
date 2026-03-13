<?php

namespace App\Notifications\Lease;

use App\Models\Lease;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendLeaseActivatedNotification extends Notification
{
    use Queueable;

    public $lease;

    public function __construct(Lease $lease)
    {
        $this->lease = $lease;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Your Lease is Now Active')
            ->greeting("Hello {$notifiable->first_name}!")
            ->line("Congratulations! Your lease for Unit {$this->lease->unit->unit_number} is now active.")
            ->line("**Move-In Date:** " . date('F j, Y', strtotime($this->lease->move_in_date)))
            ->line("**Lease Period:** " . date('F j, Y', strtotime($this->lease->start_date)) . " - " . date('F j, Y', strtotime($this->lease->end_date)))
            ->line("**Monthly Rent:** $" . number_format($this->lease->monthly_rent, 2))
            ->line("**Rent Due Day:** {$this->lease->rent_due_day} of each month")
            ->line('Your payment schedule has been created and you can view upcoming payments in your dashboard.')
            ->line('Welcome to your new home!');
    }
}
