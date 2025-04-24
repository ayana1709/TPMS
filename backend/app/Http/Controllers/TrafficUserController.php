<?php

namespace App\Http\Controllers;

use App\Models\TrafficUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Events\TrafficActivationRequested;
use App\Events\TrafficActivationStatusUpdated;
use Illuminate\Support\Facades\Auth;



class TrafficUserController extends Controller
{


    public function index(Request $request)
    {
        $manager = auth()->user(); // If manager is logged in
        $users = TrafficUser::where('manager_id', $manager->id)->get();
    
        return response()->json($users);
    }
    
    

    



    // public function index()
    // {
    //     return Auth::user()->trafficUsers; // returns only this manager's officers
    // }
    

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

    $validated['password'] = Hash::make($validated['password']);
    $validated['status'] = 'Inactive';
    // $validated['manager_id'] = Auth::id(); // 👈 link to logged-in manager
    $validated['manager_id'] = auth('manager')->id();

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


    //login 
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);
    
        $user = TrafficUser::where('username', $request->username)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }
    
        // Optional: Uncomment this if you want to restrict login to active users only
        // if ($user->status !== 'Active') {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'Your account is not active.',
        //     ], 403);
        // }
    
        // Generate Sanctum token
        $token = $user->createToken('traffic-user-token')->plainTextToken;
    
        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'username' => $user->username,
                'email' => $user->email,
                'status' => $user->status,
            ],
        ]);
    }
    
// logout

public function logout(Request $request)
{
    $user = $request->user();

    if ($user && $user->currentAccessToken()) {
        $user->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ]);
    }

    return response()->json([
        'status' => 'error',
        'message' => 'No authenticated user',
    ], 401);
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


public function requestActivation($username)
{
    $user = TrafficUser::where('username', $username)->first();

    if (!$user) {
        return response()->json(['message' => 'User not found.'], 404);
    }

    if ($user->status === 'Inactive') {
        $user->status = 'Pending';
        $user->save();

        // Trigger real-time event
        broadcast(new TrafficActivationRequested($user))->toOthers();

        return response()->json(['message' => 'Activation request sent.']);
    }

    return response()->json(['message' => 'Activation already requested or approved.']);
}


// list of pending status for manager
public function getPendingActivations()
{
    $pendingtrafficUsers = TrafficUser::where('status', 'Pending')->get();

    
    return response()->json($pendingtrafficUsers);
}


public function activate($username)
{
    try {
        $manager = TrafficUser::where('username', $username)->firstOrFail();
        $manager->status = 'Active';
        $manager->save();

        event(new TrafficActivationStatusUpdated($manager->username, 'Active'));
        


        return response()->json(['message' => 'Traffic activated and email is sent successfully!']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    // Function to deny a manager's activation request (delete manager)
    public function deny($username)
    {
        try {
            // Find the manager by username
            $manager = TrafficUser::where('username', $username)->firstOrFail();
    
            // Update the manager's status to 'inactive'
            $manager->status = 'Inactive';
            $manager->save();
            event(new TrafficActivationStatusUpdated($manager->username, 'Inactive'));

            // Optionally, trigger events or send email here if needed
            return response()->json(['message' => 'Traffic status set to inactive successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to deny manager.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }



public function checkActivationStatus($username)
{
    $user = TrafficUser::where('username', $username)->first();

    return response()->json([
        'status' => $user?->status ?? 'Inactive'
    ]);
}

    

}
