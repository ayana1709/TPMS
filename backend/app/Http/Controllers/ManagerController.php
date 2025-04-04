<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Manager;
use Illuminate\Support\Facades\Hash;

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

            $manager = Manager::create([
                'name' => $validated['name'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'],
                'region' => $validated['region'],
                'zone' => $validated['zone'],
                'woreda' => $validated['woreda'],
                'username' => $validated['username'],
                'password' => Hash::make($validated['password']),
            ]);

            return response()->json([
                'message' => 'Manager created successfully!',
                'manager' => $manager
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
