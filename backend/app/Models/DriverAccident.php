<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverAccident extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_lat',
        'location_lng',
        'timeOfAccident',
        'vehiclePlateNumber',
        'description',
        'files',
    ];
}
