<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TrafficOfficer;
use App\Models\Manager;
use App\Models\Location;

class Shift extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'start_date',
        'end_date',
        'manager_id',
    ];

public function manager()
{
    return $this->belongsTo(Manager::class);
}

   
}



