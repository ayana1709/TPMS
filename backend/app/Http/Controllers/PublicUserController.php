<?php

namespace App\Http\Controllers;

use App\Models\PublicUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PublicUserController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'phone_number'  => 'required|string|unique:public_users,phone_number',
            'email'         => 'nullable|email|unique:public_users,email',
            'password'      => 'required|string|min:6|confirmed',
            'city'          => 'required|string|max:255',
            'woreda'        => 'required|string|max:255',
            'house_number'  => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error'   => $validator->errors()->first()
            ], 422);
        }

        $user = PublicUser::create([
            'first_name'    => $request->first_name,
            'last_name'     => $request->last_name,
            'phone_number'  => $request->phone_number,
            'email'         => $request->email,
            'password'      => Hash::make($request->password),
            'city'          => $request->city,
            'woreda'        => $request->woreda,
            'house_number'  => $request->house_number,
        ]);

        // Generate token using Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Public user registered successfully',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = PublicUser::where('phone_number', $request->phone_number)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid credentials'
            ], 401);
        }

        // Generate token using Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }
}
