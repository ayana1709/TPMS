<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\ShiftAssignment;

class AttendanceController extends Controller
{
    public function record(Request $request)
    {
        $request->validate([
            'traffic_user_id' => 'required|exists:traffic_users,id',
            'shift_assignment_id' => 'required|exists:shift_assignments,id',
            'status' => 'required|in:Present,Absent',
        ]);

        $today = now()->toDateString();

        // Check if already recorded
        $existing = Attendance::where('traffic_user_id', $request->traffic_user_id)
            ->where('shift_assignment_id', $request->shift_assignment_id)
            ->where('date', $today)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Attendance already recorded.',
                'status' => $existing->status,
            ], 200);
        }

        $attendance = Attendance::create([
            'traffic_user_id' => $request->traffic_user_id,
            'shift_assignment_id' => $request->shift_assignment_id,
            'status' => $request->status,
            'date' => $today,
        ]);

        return response()->json([
            'message' => 'Attendance recorded successfully.',
            'data' => $attendance,
        ], 201);
    }
}
