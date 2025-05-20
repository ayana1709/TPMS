<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\Checkpoint;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Events\ComplaintCreated;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'datetime' => 'required|date',
            'description' => 'required|string',
            'plateNumber' => 'required|string|max:255',
            'contactInfo' => 'required|string|max:255',
            'startCoords.lat' => 'required|numeric',
            'startCoords.lng' => 'required|numeric',
            'destCoords.lat' => 'required|numeric',
            'destCoords.lng' => 'required|numeric',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048'
        ]);

        // Save uploaded files if exist
        $filePaths = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filePaths[] = $file->store('complaints', 'public');
            }
        }

        // Save complaint
        $complaint = Complaint::create([
            'type' => $request->type,
            'datetime' => $request->datetime,
            'description' => $request->description,
            'plate_number' => $request->plateNumber,
            'contact_info' => $request->contactInfo,
            'start_coords' => $request->startCoords,
            'dest_coords' => $request->destCoords,
            'file_path' => json_encode($filePaths),
        ]);

        // ComplaintCreated::dispatch($complaint);

        $start = $request->startCoords;
        $end = $request->destCoords;

        // Sample points along the route
        $routePoints = $this->sample_points($start, $end, 20);

        // Find checkpoints within 5km of any point along the route
        $checkpoints = Checkpoint::all()->filter(function ($cp) use ($routePoints) {
            foreach ($routePoints as $pt) {
                if ($this->haversine_distance($pt['lat'], $pt['lng'], $cp->latitude, $cp->longitude) <= 5) {
                    return true;
                }
            }
            return false;
        });

        // Attach checkpoints to the complaint
        $complaint->checkpoints()->attach($checkpoints->pluck('id'));

        // Get all traffic users assigned to the checkpoints along the route
        $trafficUserIds = [];
        foreach ($checkpoints as $checkpoint) {
            foreach ($checkpoint->trafficUsers as $user) {
                $trafficUserIds[] = $user->id;
            }
        }
        $trafficUserIds = array_unique($trafficUserIds);

        // Attach traffic users to the complaint
        $complaint->trafficUsers()->attach($trafficUserIds);

        return response()->json([
            'message' => 'Complaint submitted successfully.',
            'data' => $complaint,
            'notified_checkpoints' => $checkpoints->pluck('name'),
        ]);
    }

    function haversine_distance($lat1, $lng1, $lat2, $lng2)
    {
        $earthRadius = 6371; // km

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $lat1 = deg2rad($lat1);
        $lat2 = deg2rad($lat2);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             sin($dLng / 2) * sin($dLng / 2) * cos($lat1) * cos($lat2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    // Sample N points between start and end
    function sample_points($start, $end, $numPoints = 10)
    {
        $points = [];
        for ($i = 0; $i <= $numPoints; $i++) {
            $lat = $start['lat'] + ($end['lat'] - $start['lat']) * ($i / $numPoints);
            $lng = $start['lng'] + ($end['lng'] - $start['lng']) * ($i / $numPoints);
            $points[] = ['lat' => $lat, 'lng' => $lng];
        }
        return $points;
    }
}
