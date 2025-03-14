<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Use your User model
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        // Create an admin user
        User::create([
            'name' => 'admin',
            'email' => 'admin@example.com', // Change as needed
            'password' => Hash::make('admin'), // Securely hash the password
        ]);
    }
}

