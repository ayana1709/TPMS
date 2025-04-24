<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FineController extends Controller
{
   

    public function show($id)
    {
      
        $fine = Fine::with(['driver', 'officer', 'car'])->findOrFail($id);

      
        return response()->json($fine);
    }
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'driver_id' => 'required|exists:drivers,id',
            'traffic_officer_id' => 'required|exists:traffic_users,id',
            'car_id' => 'required|exists:cars,id',
            'violation_type' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'paid' => 'boolean',
            'signature' => 'nullable|string|max:255',
        ]); 

        $driver = Driver::firstOrCreate(
            ['license_number' => $request->driver_license_number],
            ['name' => 'Unknown',
             'phone_number' => $request->driver_phone ?? null
            ]
        );

        $car = Car::firstOrCreate(
            ['plate_number' => $request->car_plate],
            ['driver_id' => $driver->id]
        );


        if ($car->driver_id !== $driver->id) {
            return response()->json(['error' => 'Car does not belong to this driver.'], 403);
        }



    $violations = Violation::whereIn('id', $request->violation_ids)->get();

    if ($violations->isEmpty()) {
        return response()->json(['error' => 'No valid violations found.'], 422);
    }

    $totalAmount = $violations->sum('price');
       
         $fine = Fine::create($validatedData);

         return response()->json(['message' => 'Fine issued successfully.', 'fine' => $fine], 201);
        }
        public function getByDriver($license)
        {
            $driver = Driver::where('license_number', $license)->firstOrFail();
            $fines = Fine::where('driver_id', $driver->id)->get();

            return response()->json([
                'driver' => $driver->name,
                'license_number' => $driver->license_number,
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

