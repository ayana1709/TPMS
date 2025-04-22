<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\ViolationsImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Violations;

class ViolationController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls'
        ]);

        Excel::import(new ViolationsImport, $request->file('file'));

        return response()->json(['message' => 'Violations imported successfully']);
    }

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

public function destroy($id)
{
    $violation = Violations::findOrFail($id);
    $violation->delete();

    return response()->json(['message' => 'Violation deleted successfully']);
}


}
