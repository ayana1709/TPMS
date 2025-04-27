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





public function storeBulk(Request $request)
{
    $validated = $request->validate([
        'assignments' => 'required|array',
        'assignments.*.traffic_user_id' => 'required|integer|exists:traffic_users,id',
        'assignments.*.shift_id' => 'required|integer|exists:shifts,id',
        'assignments.*.checkpoint_id' => 'required|integer|exists:checkpoints,id',
        'assignments.*.assigned_dates' => 'required|array|min:1',
        'assignments.*.assigned_dates.*' => 'required|date',
    ]);
    $managerId = auth('manager')->id() ?? auth()->id(); // fallback if needed

    $flattenedAssignments = [];

    foreach ($validated['assignments'] as $assignment) {
        foreach ($assignment['assigned_dates'] as $date) {
            $flattenedAssignments[] = [
                'traffic_user_id' => $assignment['traffic_user_id'],
                'shift_id' => $assignment['shift_id'],
                'checkpoint_id' => $assignment['checkpoint_id'],
                'manager_id' => $managerId,
                'assigned_date' => $date,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
    }

    ShiftAssignment::insert($flattenedAssignments);

    return response()->json(['message' => 'Bulk assignments created successfully.']);
}






public function index()
{
    $assignments = ShiftAssignment::with(['trafficUser', 'shift', 'checkpoint'])
        ->orderBy('assigned_date', 'desc')
        ->get();

    return response()->json($assignments);
}




public function getByShiftId($shiftId)
{
    $managerId = auth('manager')->id() ?? auth()->id(); // fallback just in case
    $assignments = ShiftAssignment::with(['trafficUser', 'checkpoint'])
        ->where('shift_id', $shiftId)
        ->where('manager_id', $managerId)
        ->get();

    return response()->json($assignments);
}

public function getAssignedTrafficUsers(Request $request)
{
    $validated = $request->validate([
        'shift_id' => 'required|integer|exists:shifts,id',
        'manager_id' => 'required|integer|exists:managers,id',
    ]);

    $assignments = ShiftAssignment::where('shift_id', $validated['shift_id'])
        ->where('manager_id', $validated['manager_id'])
        ->with('trafficUser')
        ->get();

    $assignedTrafficUsers = $assignments->map(function ($assignment) {
        return [
            'id' => $assignment->trafficUser->id,
            'full_name' => $assignment->trafficUser->full_name,
        ];
    })
    ->unique('id') // 🛑 Remove duplicates based on user ID
    ->values();    // 🔥 Reset the array keys nicely

    return response()->json($assignedTrafficUsers);
}




}
