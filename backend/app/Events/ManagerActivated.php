<?php

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ManagerActivated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $username;

    public function __construct($username)
    {
        $this->username = $username;
    }

    public function broadcastOn()
    {
        return new Channel('manager-status');
    }

    public function broadcastAs()
    {
        return 'ManagerActivated';
    }
}
