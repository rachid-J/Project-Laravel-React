<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;

class UserNotification extends Notification
{
    protected $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function via($notifiable)
    {
        return ['database']; // Notification will be stored in the database
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->message,
        ];
    }
}
