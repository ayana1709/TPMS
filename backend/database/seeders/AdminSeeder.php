<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'username' => 'admin',  // Use username instead of email
            'password' => Hash::make('admin'), // Securely hash the password
        ]);
    }
}
