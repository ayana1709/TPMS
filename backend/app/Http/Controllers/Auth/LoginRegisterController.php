<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LoginRegisterController extends Controller
{
    public function login(Request $request)
    {
        // Validate the request inputs
        $credentials = $request->validate([
            'username' => 'required|string',  // Ensure you're validating the username
            'password' => 'required|string',  // Validate the password as well
        ]);
    
        // Attempt login using username and password
        if (!Auth::attempt(['username' => $credentials['username'], 'password' => $credentials['password']])) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        // Get the authenticated user and generate token
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }
    
}
