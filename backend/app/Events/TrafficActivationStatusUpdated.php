<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;



class TrafficActivationStatusUpdated implements ShouldBroadcast
{
    public $username;
    public $status;

    public function __construct($username, $status)
    {
        $this->username = $username;
        $this->status = $status;
    }

    public function broadcastOn()
    {
        return ['traffic-activation-status'];
    }

    public function broadcastAs()
    {
        return 'activation.status.updated';
    }
}
