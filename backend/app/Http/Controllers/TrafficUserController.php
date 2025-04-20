<?php

namespace App\Http\Controllers;

use App\Models\TrafficUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;



class TrafficUserController extends Controller
{

    // index
    public function index()
    {
        return TrafficUser::all();
    }


// store 

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

    // Hash the password
    $validated['password'] = Hash::make($validated['password']);

    // Set the default status to "Inactive"
    $validated['status'] = 'Inactive';

    $user = TrafficUser::create($validated);

    return response()->json($user, 201);
}






// show
    public function show($id)
    {
        return TrafficUser::findOrFail($id);
    }



   //update 
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

    //delte
    public function destroy($id)
    {
        $user = TrafficUser::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }


    //loogin 
   
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);
        $user = TrafficUser::where('username', $request->username)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        // Optionally deny login if the user is inactive
        // if ($user->status !== 'Active') {
        //     return response()->json(['message' => 'Account is not active'], 403);
        // }
    
        $token = $user->createToken('traffic-user-token')->plainTextToken;
        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'username' => $user->username,
                'status' => $user->status,
                'email' => $user->email,
            ],
        ]);
    }



// Update credentials (password change)
public function updateCredentials(Request $request)
{
    $request->validate([
        'old_password' => 'required|string',
        'new_password' => 'required|string|min:6|confirmed',
    ]);

    $user = auth()->user();

    if (!Hash::check($request->old_password, $user->password)) {
        return response()->json(['message' => 'Old password is incorrect'], 401);
    }

    $user->password = Hash::make($request->new_password);
    $user->save();

    return response()->json(['message' => 'Password updated successfully']);
}



//  request activation 

// TrafficUserController.php

public function requestActivation($username)
{
    $user = TrafficUser::where('username', $username)->first();

    if (!$user) {
        return response()->json(['message' => 'User not found.'], 404);
    }

    if ($user->status === 'Inactive') {
        $user->status = 'Pending';
        $user->save();

        // Optional: dispatch event or notification
        // event(new TrafficUserRequestedActivation($user));

        return response()->json(['message' => 'Activation request sent.']);
    }

    return response()->json(['message' => 'Activation already requested or approved.']);
}



//  cheack its  status 

    

}
