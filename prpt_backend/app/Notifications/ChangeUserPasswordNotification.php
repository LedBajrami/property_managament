<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class ChangeUserPasswordNotification extends Notification
{
//    use Queueable;

    public static $createUrlCallback;

    public static $toMailCallback;


    /*
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $changePasswordUrl = $this->changePasswordUrl($notifiable);

        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $changePasswordUrl);
        }

        return $this->buildMailMessage($changePasswordUrl);
    }


    protected function buildMailMessage($url)
    {
        return (new MailMessage)
            ->subject(Lang::get('InfoTelecom Set Password'))
            ->line(Lang::get('Please click the button below to set your password.'))
            ->action(Lang::get('Set Password'), $url);
    }


    protected function changePasswordUrl($notifiable)
    {
        if (static::$createUrlCallback) {
            return call_user_func(static::$createUrlCallback, $notifiable);
        }

        $url  = URL:: temporarySignedRoute(
            'password.temp.reset',
            Carbon::now()->addHours(24),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );

        return $url;
    }
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public static function createUrlUsing($callback)
    {
        static::$createUrlCallback = $callback;
    }

    /**
     * Set a callback that should be used when building the notification mail message.
     *
     * @param  \Closure  $callback
     * @return void
     */
    public static function toMailUsing($callback)
    {
        static::$toMailCallback = $callback;
    }
}
