<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\ShiftAssignment;
use Illuminate\Support\Facades\Auth;

class ShiftAssignmentController extends Controller
{
public function store(Request $request)
{
    $validated = $request->validate([
        'traffic_user_id' => 'required|exists:traffic_users,id',
        'shift_id' => 'required|exists:shifts,id',
        'checkpoint_id' => 'required|exists:checkpoints,id',
        'assigned_date' => 'required|date',
    ]);

    $validated['manager_id'] = Auth::id(); // get manager ID from the logged-in user

    $shiftAssignment = ShiftAssignment::create($validated);

    return response()->json([
        'message' => 'Shift assignment created successfully!',
        'data' => $shiftAssignment,
    ], 201);
}

}
