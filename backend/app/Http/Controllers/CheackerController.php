<?php

namespace App\Http\Controllers;

// app/Http/Controllers/CheackerController.php



use App\Models\Cheacker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CheackerController extends Controller
{
    // Get all cheackers
    public function index()
    {
        return response()->json(Cheacker::all(), 200);
    }

    // Create a new cheacker
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'username' => 'required|string|unique:cheacker',
            'email' => 'required|email|unique:cheacker',
            'password' => 'required|string|min:6',
            // 'role' => 'in:user,accounting,admin', // optional role types
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cheacker = Cheacker::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // 'role' => $request->role ?? 'user',
        ]);

        return response()->json([
            'message' => 'Cheacker created successfully!',
            'data' => $cheacker
        ], 201);
    }

    // Show specific cheacker
    public function show($id)
    {
        $cheacker = Cheacker::find($id);

        if (!$cheacker) {
            return response()->json(['message' => 'Cheacker not found'], 404);
        }

        return response()->json($cheacker);
    }

    //login function 


    public function login(Request $request)
{
    $validator = Validator::make($request->all(), [
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $cheacker = Cheacker::where('username', $request->username)->first();

    if (!$cheacker || !Hash::check($request->password, $cheacker->password)) {
        return response()->json(['message' => 'Invalid username or password'], 401);
    }

    // Generate token (you can use Laravel Sanctum, Passport or plain token)
    $token = $cheacker->createToken('cheacker-token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'cheacker' => $cheacker
    ], 200);
    // Update a cheacker
}
    public function update(Request $request, $id)
    {
        $cheacker = Cheacker::find($id);
        if (!$cheacker) {
            return response()->json(['message' => 'Cheacker not found'], 404);
        }

        $cheacker->update($request->only(['name', 'username', 'email', 'role', 'status']));

        return response()->json(['message' => 'Cheacker updated', 'data' => $cheacker]);
    }

    // Delete a cheacker
    public function destroy($id)
    {
        $cheacker = Cheacker::find($id);
        if (!$cheacker) {
            return response()->json(['message' => 'Cheacker not found'], 404);
        }

        $cheacker->delete();

        return response()->json(['message' => 'Cheacker deleted']);
    }
}
