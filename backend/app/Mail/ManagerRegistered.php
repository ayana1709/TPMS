<?php

namespace App\Mail;

use App\Models\Manager;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ManagerRegistered extends Mailable
{
    use Queueable, SerializesModels;


    /**
     * Create a new message instance.
     */
    public $manager;
    public $plainPassword;
    
    public function __construct(Manager $manager, $plainPassword)
    {
        $this->manager = $manager;
        $this->plainPassword = $plainPassword;
    }
    

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Your Manager Account Info')
                    ->markdown('emails.manager.registered')
                    ->with([
                        'manager' => $this->manager,
                        'plainPassword' => $this->plainPassword,
                    ]);
    }
    
}
