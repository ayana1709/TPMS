<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\ViolationsImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Violation;

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
        return response()->json(Violation::all());
    }
}
