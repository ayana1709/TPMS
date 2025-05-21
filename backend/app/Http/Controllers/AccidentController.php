<?php
// app/Http/Controllers/AccidentController.php
namespace App\Http\Controllers;

use App\Models\Accident;
use App\Models\Checkpoint;
use Illuminate\Http\Request;

class AccidentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_lat' => 'required|numeric',
            'location_lng' => 'required|numeric',
            'timeOfAccident' => 'required|date',
            'vehiclePlateNumber' => 'nullable|string|max:255',
            'description' => 'required|string',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf,mp4,mov|max:4096',
        ]);

        // Store files
        $filePaths = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filePaths[] = $file->store('accidents', 'public');
            }
        }

        // Save accident
        $accident = Accident::create([
            'location_lat' => $request->location_lat,
            'location_lng' => $request->location_lng,
            'time_of_accident' => $request->timeOfAccident,
            'vehicle_plate_number' => $request->vehiclePlateNumber,
            'description' => $request->description,
            'files' => $filePaths,
        ]);

        // Find checkpoints within 5km of the accident location
        $checkpoints = Checkpoint::all()->filter(function ($cp) use ($request) {
            return $this->haversine_distance(
                $request->location_lat,
                $request->location_lng,
                $cp->latitude,
                $cp->longitude
            ) <= 5;
        });

        // Attach checkpoints to the accident
        $accident->checkpoints()->attach($checkpoints->pluck('id'));

        return response()->json(['message' => 'Accident reported successfully.']);
    }

    // Haversine formula to calculate distance in KM
    private function haversine_distance($lat1, $lon1, $lat2, $lon2)
    {
        $earth_radius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat/2) * sin($dLat/2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon/2) * sin($dLon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $earth_radius * $c;
    }


    public function index()
{
    $accidents = Accident::all();

    return response()->json($accidents);
}

// public function index()
// {
//     $accidents = Accident::with('checkpoints')->get();

//     return response()->json($accidents);
// }

}