<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use App\Models\Violation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FineController extends Controller
{

    public function index()
{
    $fines = Fine::with('violations')->latest()->get();

    return response()->json([
        'status' => 'success',
        'message' => 'Fines fetched successfully',
        'data' => $fines
    ]);
}

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            // Validate the incoming request data
            $validatedData = $request->validate([
                'full_name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'contact_number' => 'required|string|max:20',
                'drivers_license_number' => 'required|string|max:50',
                'vehicle_registration_number' => 'required|string|max:50',
                'vehicle_type' => 'required|string|max:50',
                'date_of_offense' => 'required|date',
                'time_of_offense' => 'required|date_format:H:i',
                'location' => 'required|string|max:255',
                'incident_description' => 'required|string',
                'total_fine_amount' => 'required|numeric|min:0',
                'due_date' => 'required|date',
                'officer_name' => 'required|string|max:255',
                'badge_number' => 'required|string|max:50',
                'police_station' => 'required|string|max:255',
                'violations' => 'required|array',
                'violations.*.code' => 'required|string',
                'violations.*.type' => 'required|string',
                'violations.*.amount' => 'required|numeric|min:0',
                'violations.*.description' => 'required|string',
                'violations.*.demeritPoint' => 'required|integer|min:0',
            ]);
            // Create the fine
            $fine = Fine::create($validatedData);
            // Create violations
            foreach ($request->violations as $violationData) {
                $fine->violations()->create([
                    'code' => $violationData['code'],
                    'type' => $violationData['type'],
                    'amount' => $violationData['amount'],
                    'description' => $violationData['description'],
                    'demerit_points' => $violationData['demeritPoint']
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Fine recorded successfully',
                'data' => $fine->load('violations')
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Fine creation error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to record fine: ' . $e->getMessage()
            ], 500);
        }
    }



public function updateFine(Request $request)
{
    try {
        $license = $request->input('license');
        $fineId = $request->input('fine_id');

        if (!$license && !$fineId) {
            return response()->json([
                'status' => 'error',
                'message' => 'License or Fine ID is required',
            ], 400);
        }

        $fine = null;

        if ($fineId) {
            $fine = Fine::find($fineId);
        } elseif ($license) {
            $fine = Fine::where('drivers_license_number', $license)->first();
        }

        if (!$fine) {
            return response()->json([
                'status' => 'error',
                'message' => 'Fine not found',
            ], 404);
        }

        $fine->is_paid = true;
        $fine->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Fine marked as paid successfully',
            'data' => $fine->fresh()
        ]);
    } catch (\Exception $e) {
        \Log::error('Error updating fine: ' . $e->getMessage());
        return response()->json([
            'status' => 'error',
            'message' => 'An error occurred while updating the fine',
        ], 500);
    }
}






    public function show($id)
    {
        $fine = Fine::with('violations')->findOrFail($id);
        return response()->json($fine);
    }

    public function getByDriver($license)
    {
        $fines = Fine::where('drivers_license_number', $license)
                    ->with('violations')
                    ->get();

        return response()->json([
            'license_number' => $license,
            'fines' => $fines
        ]);
    }


    public function markAsPaid(Request $request)
    {
        $request->validate([
            'fine_id' => 'required|exists:fines,id',
            'amount_paid' => 'required|numeric',
            'payment_type' => 'required|string'
        ]);

        $fine = Fine::findOrFail($request->fine_id);
        $fine->is_paid = true;
        $fine->save();

        return response()->json(['message' => 'Fine marked as paid.']);
    }
}

