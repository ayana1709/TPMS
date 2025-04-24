<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;



class ShiftController extends Controller
{
   
    public function index(Request $request)
    {
        $manager = auth()->user(); // If manager is logged in
        $users = Shift::where('manager_id', $manager->id)->get();
    
        return response()->json($users);
    }




public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'start_time' => 'required|date_format:H:i:s',
        'end_time' => 'required|date_format:H:i:s|after:start_time',
        'start_date' => 'required|date_format:Y-m-d',
        'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
    ]);

    // ✅ Automatically set manager_id from the logged-in manager
    $validated['manager_id'] = auth('manager')->id();


    $shift = Shift::create($validated);

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
