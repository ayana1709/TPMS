<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = ['username', 'password'];

    protected $hidden = ['password'];

    public function getAuthIdentifierName()
    {
        return 'username'; // Login using username instead of email
    }
}
