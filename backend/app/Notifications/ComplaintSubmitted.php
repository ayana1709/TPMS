<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class ComplaintSubmitted extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
  public function __construct($complaint)
{
    $this->complaint = $complaint;
}


    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
 

public function via($notifiable)
{
    return ['broadcast', 'database']; // optional: also store in DB
}

public function toBroadcast($notifiable)
{
    return new BroadcastMessage([
        'message' => 'A new complaint has been submitted near your checkpoint!',
        'complaint_id' => $this->complaint->id,
    ]);
}


    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
