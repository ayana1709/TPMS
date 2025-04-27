<?php

namespace App\Http\Controllers;

use App\Http\Requests\IssueViolationRequest;
use App\Http\Requests\PayViolationRequest;
use App\Imports\ViolationsImport;
use App\Models\Violations;
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
        return response()->json(Violations::all());
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

/**
 * Fetch violation details by code.
 */
public function getByCode($code)
{
    $violation = Violations::where('code', $code)->first(); // fetch by code only

    if (!$violation) {
        return response()->json(['message' => 'Violation not found.'], 404);
    }

    return response()->json([
        'code' => $violation->code,
        'category' => $violation->category,
        'description' => $violation->violation_name,
        'fine_birr' => $violation->fine_birr,
        'demerit_points' => $violation->demerit_points,
        'offense_type' => $violation->offence_type, // return offense_type from database
    ]);
}







public function searchByName(Request $request)
{
    $query = $request->query('name');
    $violations = Violations::where('violation_name', 'like', "%$query%")
        ->limit(10)
        ->get();

    return response()->json($violations);
}




public function destroy($id)
{
    $violation = Violations::findOrFail($id);
    $violation->delete();

    return response()->json(['message' => 'Violation deleted successfully']);
}


}
