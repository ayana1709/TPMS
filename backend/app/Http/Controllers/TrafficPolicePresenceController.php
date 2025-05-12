<?php

namespace App\Http\Controllers;

use App\Models\TrafficPoliceAssignment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TrafficPolicePresenceController extends Controller
{
    public function checkPresence(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $assignment = TrafficPoliceAssignment::where('user_id', $request->user_id)
            ->whereDate('assignment_date', now())
            ->first();

        if (!$assignment) {
            return response()->json([
                'status' => 'error',
                'message' => 'No assignment found for today'
            ], 404);
        }

        $isWithinTimeRange = $assignment->isWithinTimeRange();
        $isWithinLocation = $assignment->isWithinLocation(
            $request->latitude,
            $request->longitude
        );

        return response()->json([
            'status' => 'success',
            'data' => [
                'is_present' => $isWithinTimeRange && $isWithinLocation,
                'time_check' => $isWithinTimeRange,
                'location_check' => $isWithinLocation,
                'assignment_details' => [
                    'location_name' => $assignment->location_name,
                    'start_time' => $assignment->start_time,
                    'end_time' => $assignment->end_time,
                    'radius_meters' => $assignment->radius_meters
                ]
            ]
        ]);
    }
} 