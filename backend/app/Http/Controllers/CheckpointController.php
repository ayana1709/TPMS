<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Checkpoint;
use Illuminate\Support\Facades\Auth;

class CheckpointController extends Controller
{
    // List all checkpoints
    // public function index()
    // {
    //     $checkpoints = Checkpoint::all();
    //     return response()->json([
    //         'data' => $checkpoints
    //     ]);
    // }
    public function index(Request $request)
    {
        $manager = auth()->user(); // If manager is logged in
        $users = Checkpoint::where('manager_id', $manager->id)->get();
    
        return response()->json($users);
    }






    // Show a single checkpoint
    public function show($id)
    {
        $checkpoint = Checkpoint::find($id);

        if (!$checkpoint) {
            return response()->json(['message' => 'Checkpoint not found'], 404);
        }

        return response()->json([
            'data' => $checkpoint
        ]);
    }




    

    // Create a new checkpoint

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|integer|min:10',
            'description' => 'nullable|string',
        ]);
    $validated['manager_id'] = auth('manager')->id();
        $checkpoint = Checkpoint::create($validated);
        return response()->json([
            'message' => 'Checkpoint registered successfully.',
            'data' => $checkpoint
        ], 201);
    }
    
    







    // Update an existing checkpoint
    public function update(Request $request, $id)
    {
        $checkpoint = Checkpoint::find($id);

        if (!$checkpoint) {
            return response()->json(['message' => 'Checkpoint not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'latitude' => 'sometimes|required|numeric',
            'longitude' => 'sometimes|required|numeric',
            'radius' => 'sometimes|required|integer|min:10',
        ]);

        $checkpoint->update($validated);

        return response()->json([
            'message' => 'Checkpoint updated successfully.',
            'data' => $checkpoint
        ]);
    }

    // Delete a checkpoint
    public function destroy($id)
    {
        $checkpoint = Checkpoint::find($id);

        if (!$checkpoint) {
            return response()->json(['message' => 'Checkpoint not found'], 404);
        }

        $checkpoint->delete();

        return response()->json([
            'message' => 'Checkpoint deleted successfully.'
        ]);
    }
}
