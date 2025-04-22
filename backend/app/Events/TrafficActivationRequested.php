<?php

namespace App\Events;

use App\Models\TrafficUser;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class TrafficActivationRequested implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;

    public function __construct(TrafficUser $user)
    {
        $this->user = $user;
    }

    public function broadcastOn()
    {
        return new Channel('traffic-activations');
    }

    public function broadcastWith()
    {
        return [
            'username' => $this->user->username,
            'name' => $this->user->full_name,
            'status' => $this->user->status,
        ];
    }

    public function broadcastAs()
    {
        return 'activation.requested';
    }
}
