<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manager extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'phone',
        'email',
        'region',
        'zone',
        'woreda',
        'username',
        'password',
        "temp_password"
    ];
    
}
