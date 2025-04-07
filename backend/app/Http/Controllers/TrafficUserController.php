<?php

namespace App\Http\Controllers;

use App\Models\TrafficUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TrafficUserController extends Controller
{
    public function index()
    {
        return TrafficUser::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string',
            'badge_number' => 'required|string|unique:traffic_users',
            'rank' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email|unique:traffic_users',
            
            'username' => 'required|string|unique:traffic_users',
            'password' => 'required|string|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = TrafficUser::create($validated);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        return TrafficUser::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $user = TrafficUser::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'sometimes|string',
            'badge_number' => 'sometimes|string|unique:traffic_users,badge_number,' . $id,
            'rank' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'email' => 'sometimes|email|unique:traffic_users,email,' . $id,
            'station' => 'sometimes|string',
            'username' => 'sometimes|string|unique:traffic_users,username,' . $id,
            'password' => 'nullable|string|min:6',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = TrafficUser::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
