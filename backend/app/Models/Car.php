<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'plate_number',
        'vin',
        'model',
        'chasis_number',
        'car_ownership_path',
        'car_bollo_path',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }




}
