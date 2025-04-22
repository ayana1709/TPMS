<?php




namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Manager extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'region',
        'zone',
        'woreda',
        'username',
        'password',
        'temp_password',
        'status',
        
    ];

    protected $hidden = [
        'password',
        'temp_password',
        'remember_token',
    ];



// Manager.php

public function trafficUsers()
{
    return $this->hasMany(TrafficUser::class);
}



    
}
