<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   

    /**
     * Show the form for creating a new resource.
     */
    public function index()
    {
        return response()->json(Shift::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
          {
            $request->validate([
                'name' => 'sometimes|string|max:255',
                'start_time' => 'sometimes|date_format:H:i:s',
                'end_time' => 'sometimes|date_format:H:i:s|after:start_time',
                'start_date' => 'sometimes|date_format:Y-m-d',
                'end_date' => 'sometimes|date_format:Y-m-d|after_or_equal:start_date',
            ]);
            
         


        $shift = Shift::create($request->all());

        return response()->json(['message' => 'Shift created successfully', 'shift' => $shift], 201);
     

         }

    /**
     * Display the specified resource.
     */
    public function  show($id)
    {
        $shift = Shift::find($id);
        if (!$shift) {
            return response()->json(['message' => 'Shift not found'], 404);
        }
        return response()->json($shift);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function update(Shift $shift, $id)
    {
         
        $shift = Shift::find($id);
        if (!$shift) {
            return response()->json(['message' => 'Shift not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'start_time' => 'sometimes|date_format:H:i:s',
            'end_time' => 'sometimes|date_format:H:i:s|after:start_time',
            'start_date' => 'sometimes|date_format:Y-m-d',
            'end_date' => 'sometimes|date_format:Y-m-d|after_or_equal:start_date',
        ]);
        

        $shift->update($request->all());
        return response()->json(['message' => 'Shift updated successfully', 'shift' => $shift]);

    }

    /**
     * Update the specified resource in storage.
     */
   

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shift $shift)
    {
        $shift = Shift::find($id);
        if (!$shift) {
            return response()->json(['message' => 'Shift not found'], 404);
        }

        $shift->delete();

        return response()->json(['message' => 'Shift deleted successfully']);
    }
}
