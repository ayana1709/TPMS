<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id', 'traffic_officer_id', 'car_id',
        'violation_type', 'amount', 'paid', 'signature'
    ];

    public function driver() {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    public function officer() {
        return $this->belongsTo(TrafficUser::class, 'traffic_officer_id');
    }

    public function car() {
        return $this->belongsTo(Car::class);
    }
}
