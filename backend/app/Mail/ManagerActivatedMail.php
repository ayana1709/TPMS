<?php

namespace App\Mail;

use App\Models\Manager;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ManagerActivatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $manager;

    public function __construct(Manager $manager)
    {
        $this->manager = $manager;
    }

    public function build()
    {
        return $this->subject('Your Manager Account Has Been Activated')
                    ->html("
                        <h2>Hello {$this->manager->name},</h2>
                        <p>Your manager account has been activated. You can now log in and access your dashboard.</p>
                    ");
    }
}
