<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// app/Models/Complaint.php
class Complaint extends Model
{
    protected $fillable = [
        'type', 'datetime', 'description', 'plate_number', 'contact_info',
        'start_coords', 'dest_coords', 'file_path'
    ];

    protected $casts = [
        'start_coords' => 'array',
        'dest_coords' => 'array',
    ];

    public function checkpoints()
    {
        return $this->belongsToMany(Checkpoint::class, 'checkpoint_complaint');
    }

    public function trafficUsers()
    {
        return $this->belongsToMany(TrafficUser::class, 'complaint_traffic_user');
    }
}

