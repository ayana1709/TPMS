<?php

namespace App\Events;

use App\Models\Manager;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ManagerActivated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $manager;

    public function __construct(Manager $manager)
    {
        $this->manager = $manager->toArray(); // 👈 safely convert model
    }

    public function broadcastOn()
    {
        return new Channel('activation-channel');
    }

    public function broadcastAs()
    {
        return 'manager-activated';
    }
}