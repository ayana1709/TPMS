<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Manager;
use Illuminate\Support\Facades\Hash;
use App\Mail\ManagerRegistered;
use Illuminate\Support\Facades\Mail;
use App\Events\ManagerActivated;
use App\Events\ManagerActivationRequested;
use App\Events\ManagerRequestedActivation;
use ManagerActivated as GlobalManagerActivated;

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

public function index()
{
    $managers = Manager::select('name', 'phone', 'email', 'region', 'zone', 'woreda', 'username', 'status')->get();

    return response()->json($managers);
}

public function update(Request $request, $oldUsername)
{
    try {
        // Find the manager using the old username
        $manager = Manager::where('username', $oldUsername)->firstOrFail();

        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:255',
            'region' => 'required|string|max:255',
            'zone' => 'required|string|max:255',
            'woreda' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:managers,username,' . $manager->id,
            'password' => 'nullable|string|min:6',
            'status' => 'required|string|in:Active,Inactive,Pending',

        ]);

        // Update the manager info
        $manager->update([
            'name' => $validated['name'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'],
            'region' => $validated['region'],
            'zone' => $validated['zone'],
            'woreda' => $validated['woreda'],
            'username' => $validated['username'],
            'status' => $validated['status'],
        ]);

        // If new password is provided, hash and update it
        if (!empty($validated['password'])) {
            $manager->password = Hash::make($validated['password']);
            $manager->temp_password = $validated['password'];
            $manager->save();
        }

        return response()->json([
            'message' => 'Manager updated successfully!',
            'manager' => $manager,
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Update failed.',
            'details' => $e->getMessage(),
        ], 500);
    }
}

public function destroy($username)
{
    try {
        $manager = Manager::where('username', $username)->firstOrFail();
        $manager->delete();

        return response()->json([
            'message' => 'Manager deleted successfully.'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Delete failed.',
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

        // // ✅ Clear temp password after sending the email
        // $manager->temp_password = null;
        // $manager->save();

        return response()->json(['message' => 'Manager info sent successfully!']);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to send email',
            'message' => $e->getMessage(),
        ], 500);
    }
}




public function login(Request $request)
{
    $request->validate([
        'username' => 'required',
        'password' => 'required',
    ]);

    $manager = Manager::where('username', $request->username)->first();

    if (!$manager || !Hash::check($request->password, $manager->password)) {
        return response()->json(['status' => 'fail', 'message' => 'Invalid credentials'], 401);
    }

    // ✅ allow login regardless of status
    $token = $manager->createToken('manager_token')->plainTextToken;

    return response()->json([
        'status' => 'success',
        'token' => $token,
        'manager' => [
            'name' => $manager->name,
            'username' => $manager->username,
            'email' => $manager->email,
            'status' => $manager->status, // important
        ],
    ]);
}


public function updateCredentials(Request $request)
{
    $request->validate([
        'username' => 'nullable|string|unique:managers,username,' . auth()->id(),
        'old_password' => 'required|string',
        'new_password' => 'required|string|min:6|confirmed',
    ]);

    $manager = auth()->user();

    // Check if old password matches
    if (!Hash::check($request->old_password, $manager->password)) {
        return response()->json(['status' => 'fail', 'message' => 'Old password is incorrect'], 401);
    }

    // Update password
    $manager->password = Hash::make($request->new_password);
    $manager->temp_password = null;

    // Update username if provided
    if ($request->filled('username')) {
        $manager->username = $request->username;
    }

    $manager->save();

    return response()->json([
        'status' => 'success',
        'message' => 'Credentials updated successfully',
        'manager' => $manager
    ]);
}


// Request activation from manager  to admin 




// public function requestActivation($username)
// {
//     $manager = Manager::where('username', $username)->first();

//     if (!$manager) {
//         return response()->json(['message' => 'Manager not found'], 404);
//     }

//     // Broadcast real-time event to admin
//     event(new ManagerActivationRequested($manager));

//     return response()->json(['message' => 'Activation request sent successfully']);
// }

public function requestActivation($username)
{
    $manager = Manager::where('username', $username)->firstOrFail();

    if ($manager->status === 'Inactive') {
        $manager->status = 'Pending';
        $manager->save();

        event(new ManagerRequestedActivation($manager)); // Optional: Trigger event
        return response()->json(['message' => 'Activation request sent.']);
    }

    return response()->json(['message' => 'Manager already requested or activated.']);
}






public function listInactive()
{
    $inactiveManagers = Manager::where('status', 'Inactive')->get();

    return response()->json($inactiveManagers);
}
public function activate($username)
{
    $manager = Manager::where('username', $username)->firstOrFail();
    $manager->status = 'Active';
    $manager->save();

    event(new GlobalManagerActivated($username)); // Optional: real-time event
    Mail::to($manager->email)->send(new AccountActivatedMail($manager));

    return response()->json(['message' => 'Manager activated']);
}

// Get all managers who are requesting activation
public function getPendingActivations()
{
    $pendingManagers = Manager::where('status', 'Pending')->get();
    return response()->json($pendingManagers);
}

public function activateManager($username)
{
    $manager = Manager::where('username', $username)->first();

    if (!$manager) {
        return response()->json(['error' => 'Manager not found'], 404);
    }

    $manager->status = 'Active';
    $manager->save();

    // Optionally fire an event or email
    event(new ManagerActivated($manager));

    return response()->json(['message' => 'Manager activated successfully']);
}


}
