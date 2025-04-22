<?php

namespace App\Http\Controllers;

use App\Http\Requests\IssueViolationRequest;
use App\Http\Requests\PayViolationRequest;
use App\Imports\ViolationsImport;
use App\Models\Violation;
use App\Models\TrafficLaw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class ViolationController extends Controller
{
    /**
     * Import violations from an Excel file.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls'
        ]);

        Excel::import(new ViolationsImport, $request->file('file'));

        return response()->json(['message' => 'Violations imported successfully']);
    }

    /**
     * List all violations.
     */
    public function index()
    {
        return response()->json(Violation::all());
    }

    /**
     * Issue a new violation.
     */
    public function issue(IssueViolationRequest $request)
    {
        $law = TrafficLaw::findOrFail($request->law_number);
        $penalty = $law->penalty_amount;

        $violation = Violation::create([
            'driver_id' => $request->driver_id,
            'car_id' => $request->car_id,
            'law_number' => $request->law_number,
            'officer_id' => Auth::id(),
            'penalty_amount' => $penalty,
            'signed' => false,
            'signed_at' => null,
            'paid' => false,
            'paid_at' => null,
        ]);

        return response()->json([
            'message' => 'Violation issued successfully',
            'violation' => $violation,
        ], 201);
    }

    /**
     * Pay a violation.
     */
    public function pay(PayViolationRequest $request)
    {
        $violation = Violation::findOrFail($request->violation_id);

        $violation->update([
            'paid' => true,
            'paid_at' => now(),
        ]);

        return response()->json(['message' => 'Violation paid']);
    }

    /**
     * List violations for the authenticated driver (optional).
     */
    public function driverViolations()
    {
        $driverId = Auth::id();

        $violations = Violation::with('law', 'car', 'officer')
            ->where('driver_id', $driverId)
            ->get();

        return response()->json($violations);
    }

    public function update(Request $request, $id)
{
    $violation = Violations::findOrFail($id);

    $request->validate([
        'code' => 'required|string',
        'violation_name' => 'required|string',
        'category' => 'required|string',
        'offence_type' => 'required|string',
        'demerit_points' => 'required|string',
        'fine_birr' => 'required|numeric',
        'action_description' => 'nullable|string',
    ]);

    $violation->update($request->all());

    return response()->json(['message' => 'Violation updated successfully', 'data' => $violation]);
}

public function destroy($id)
{
    $violation = Violations::findOrFail($id);
    $violation->delete();

    return response()->json(['message' => 'Violation deleted successfully']);
}


}
