<?php

namespace App\Events;

use App\Models\Manager;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ManagerRequestedActivation implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $manager;

    public function __construct(Manager $manager)
    {
        $this->manager = $manager;
    }

    // 👇 Public channel name
    public function broadcastOn()
    {
        return new Channel('activation-channel');
    }

    // 👇 Optional: customize event name
    public function broadcastAs()
    {
        return 'manager-requested';
    }
}

