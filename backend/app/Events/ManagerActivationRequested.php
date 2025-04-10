<?php

// app/Events/ManagerActivationRequested.php
namespace App\Events;

use App\Models\Manager;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class ManagerActivationRequested implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $manager;

    public function __construct(Manager $manager)
    {
        $this->manager = $manager;
    }

    public function broadcastOn()
    {
        return new Channel('activation-requests');
    }

    public function broadcastAs()
    {
        return 'manager.activation.requested';
    }
}
