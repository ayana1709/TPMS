<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ShiftController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Returning all shifts as a JSON response.
        return response()->json(Shift::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
            'manager_id' => 'required|exists:managers,id',
        ]);
    
        $shift = Shift::create([
            'name' => $request->name,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'manager_id' => $request->manager_id,
        ]);
    
        return response()->json([
            'message' => 'Shift created successfully',
            'shift' => $shift
        ], 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Find the shift by its ID
        $shift = Shift::find($id);
        
        if (!$shift) {
            // Return a 404 response if the shift is not found
            return response()->json(['message' => 'Shift not found'], 404);
        }

        // Return the shift data as JSON
        return response()->json($shift);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Find the shift by its ID
        $shift = Shift::find($id);

        if (!$shift) {
            // Return a 404 response if the shift is not found
            return response()->json(['message' => 'Shift not found'], 404);
        }

        // Validate incoming request data
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'start_time' => 'sometimes|date_format:H:i:s',
            'end_time' => 'sometimes|date_format:H:i:s|after:start_time',
            'start_date' => 'sometimes|date_format:Y-m-d',
            'end_date' => 'sometimes|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        // Update the shift with the validated data
        $shift->update($request->all());

        // Return a success response with the updated shift data
        return response()->json([
            'message' => 'Shift updated successfully',
            'shift' => $shift
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the shift by its ID
        $shift = Shift::find($id);

        if (!$shift) {
            // Return a 404 response if the shift is not found
            return response()->json(['message' => 'Shift not found'], 404);
        }

        // Delete the shift
        $shift->delete();

        // Return a success response
        return response()->json(['message' => 'Shift deleted successfully']);
    }
}
