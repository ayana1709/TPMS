<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    use HasFactory;
    protected $fillable = [
        'driver_id', 'car_id', 'rule_id', 'officer_id', 'penalty_amount',
        'signed', 'signed_at', 'paid', 'paid_at',
    ];

    public function driver() { 
        return $this->belongsTo(User::class, 'driver_id');
               
    }
    public function officer() { 

        return $this->belongsTo(User::class, 'officer_id');
     }
    public function car()     { 
        return $this->belongsTo(Car::class); 
    
    }
    public function rule()    {
        
         return $this->belongsTo(TrafficRule::class); 
        }
}




