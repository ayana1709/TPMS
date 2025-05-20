<?php

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class ComplaintCreated implements ShouldBroadcast
{
    use SerializesModels;

    public $complaint;
    public $checkpointId;

    public function __construct($complaint, $checkpointId)
    {
        $this->complaint = $complaint;
        $this->checkpointId = $checkpointId;
    }

    public function broadcastOn()
    {
        return new Channel('checkpoint.' . $this->checkpointId);
    }

    public function broadcastWith()
    {
        return [
            'type' => $this->complaint->type,
            'startCoords' => $this->complaint->startCoords,
            'destCoords' => $this->complaint->destCoords,
            'description' => $this->complaint->description,
        ];
    }
}

