<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrafficUser extends Model
{
    use HasFactory;
    protected $fillable = [
        'full_name', 'badge_number', 'rank', 'phone', 'email',
         'username', 'password'
    ];
    
    protected $hidden = ['password'];
    
}
