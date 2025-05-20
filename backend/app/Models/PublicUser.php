<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens; // <-- Add this


class PublicUser extends Authenticatable
{
     use HasApiTokens;
    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'email',
        'password',
        'city',
        'woreda',
        'house_number',
    ];

    protected $hidden = [
        'password',
    ];
}
