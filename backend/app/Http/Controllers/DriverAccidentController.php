<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DriverAccident;

class DriverAccidentController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'location_lat' => 'required|numeric',
            'location_lng' => 'required|numeric',
            'timeOfAccident' => 'required|date',
            'vehiclePlateNumber' => 'nullable|string',
            'description' => 'required|string',
            'files' => 'nullable',
        ]);

        // Handle file uploads if present
        if ($request->hasFile('files')) {
            $filePaths = [];
            foreach ($request->file('files') as $file) {
                $filePaths[] = $file->store('accidents', 'public');
            }
            $data['files'] = json_encode($filePaths);
        }

        $accident = DriverAccident::create($data);

        return response()->json([
            'message' => 'Accident reported successfully.',
            'accident' => $accident
        ], 201);
    }
}
