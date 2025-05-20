<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['username', 'email', 'password'];

    protected $hidden = ['password'];

    protected $casts = [
        'password' => 'hashed', // Laravel v10+ auto-hashes
    ];

    public function getAuthIdentifierName()
    {
        return 'username'; // Ensure authentication uses username
    }
}