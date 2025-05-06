<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Driver extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'full_name',
        'phone_number',
        'email',
        'region',
        'zone',
        'wereda',
        'password',
        'license_number',
        'driver_license_path',
        'status',
    ];

    protected $hidden = [
        'password',
    ];

    // public function cars()
    // {
    //     return $this->hasMany(Car::class);
    // }
    public function car()
    {
        return $this->hasOne(Car::class);
}
}