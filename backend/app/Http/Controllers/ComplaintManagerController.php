<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ComplaintManager; // ✅ Import the model
use Illuminate\Support\Facades\Storage;

class ComplaintManagerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:complaint,request',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'attachment' => 'nullable|file|max:4096|mimes:jpg,jpeg,png,pdf,docx'
        ]);

        $path = null;
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('manager_complaints', 'public');
        }

        $complaint = ComplaintManager::create([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'attachment' => $path,
        ]);

        return response()->json([
            'message' => 'Complaint/Request submitted successfully.',
            'data' => $complaint
        ], 201);
    }
}
