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
             // Ensure your User model has a 'name' field
            'username' => 'admin', 
            'email' => 'admin@example.com', // Ensure an email is provided if required
            'password' => Hash::make('admin'), 
        ]);
    }
}
