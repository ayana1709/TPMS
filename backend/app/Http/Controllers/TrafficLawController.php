<?php

namespace App\Http\Controllers;

use App\Models\TrafficLaw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TrafficLawController extends Controller
{
    public function index()
    {
        $laws = TrafficLaw::all();
        return response()->json($laws);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'law_number' => 'required|string|unique:traffic_laws',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'penalty_amount' => 'required|numeric|min:0',
            'penalty_description' => 'required|string',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $law = TrafficLaw::create($request->all());
        return response()->json($law, 201);
    }

    public function show($id)
    {
        $law = TrafficLaw::findOrFail($id);
        return response()->json($law);
    }

    public function update(Request $request, $id)
    {
        $law = TrafficLaw::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'law_number' => 'string|unique:traffic_laws,law_number,' . $id,
            'title' => 'string|max:255',
            'description' => 'string',
            'penalty_amount' => 'numeric|min:0',
            'penalty_description' => 'string',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $law->update($request->all());
        return response()->json($law);
    }

    public function destroy($id)
    {
        $law = TrafficLaw::findOrFail($id);
        $law->delete();
        return response()->json(null, 204);
    }
} 