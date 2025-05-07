<?php

// app/Models/Cheacker.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // use if this model logs in
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Cheacker extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'cheacker'; // optional if it matches naming convention

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        // 'role',
        // 'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
