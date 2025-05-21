<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DriverComplaint;

class DriverComplaintController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string',
            'datetime' => 'required|date',
            'description' => 'required|string',
            'plateNumber' => 'nullable|string',
            'contactInfo' => 'nullable|string',
            'startCoords' => 'nullable|string',
            'destCoords' => 'nullable|string',
            'files' => 'nullable',
        ]);

        // Handle file uploads if needed
        if ($request->hasFile('files')) {
            $filePaths = [];
            foreach ($request->file('files') as $file) {
                $filePaths[] = $file->store('complaints', 'public');
            }
            $data['files'] = json_encode($filePaths);
        }

        $complaint = DriverComplaint::create($data);

        return response()->json([
            'message' => 'Complaint submitted successfully.',
            'complaint' => $complaint
        ], 201);
    }
}
