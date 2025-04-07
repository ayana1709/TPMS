<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Manager;
use Illuminate\Support\Facades\Hash;
use App\Mail\ManagerRegistered;
use Illuminate\Support\Facades\Mail;


class ManagerController extends Controller
{


public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:255',
            'region' => 'required|string|max:255',
            'zone' => 'required|string|max:255',
            'woreda' => 'required|string|max:255',
            'username' => 'required|string|unique:managers,username',
            'password' => 'required|string|min:6',
        ]);

        $plainPassword = $validated['password'];

        $manager = Manager::create([
            'name' => $validated['name'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'],
            'region' => $validated['region'],
            'zone' => $validated['zone'],
            'woreda' => $validated['woreda'],
            'username' => $validated['username'],
            'password' => Hash::make($plainPassword),
            'temp_password' => $plainPassword, // ✅ store plain password for email
            'status' => 'Inactive', // default status
        ]);

        

        return response()->json([
            'message' => 'Manager created and email sent successfully!',
            'manager' => $manager
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Something went wrong.',
            'details' => $e->getMessage(),
        ], 500);
    }
}

    
public function sendInfoEmail($username)
{
    $manager = Manager::where('username', $username)->first();

    if (!$manager) {
        return response()->json(['error' => 'Manager not found'], 404);
    }

    try {
        $plainPassword = $manager->temp_password ?? 'Not available';

        // Send email
        Mail::to($manager->email)->send(new ManagerRegistered($manager, $plainPassword));

        // ✅ Clear temp password after sending the email
        $manager->temp_password = null;
        $manager->save();

        return response()->json(['message' => 'Manager info sent successfully!']);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to send email',
            'message' => $e->getMessage(),
        ], 500);
    }
}

}
