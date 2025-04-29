<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\Car;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DriverRegistrationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            // Driver validation
            'fullName' => 'required|string|max:255',
            'phoneNumber' => 'required|string|max:20',
            'email' => 'required|email|unique:drivers,email',
            'region' => 'required|string|max:100',
            'zone' => 'required|string|max:100',
            'wereda' => 'required|string|max:100',
            'password' => 'required|string|min:6',
            'licenseNumber' => 'required|string|unique:drivers,license_number',
            'driverLicense' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',

            // Car validation
            'carPlateNumber' => 'required|string|unique:cars,plate_number',
            'vin' => 'nullable|string|max:100',
            'carModel' => 'nullable|string|max:100',
            'ChasisNumber' => 'nullable|string|max:100',
            'carOwnership' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'carBollo' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        try {
            // Store driver license
            $driverLicensePath = $request->file('driverLicense')->store('driver_licenses');

            // Create driver
            $driver = Driver::create([
                'full_name' => $request->fullName,
                'phone_number' => $request->phoneNumber,
                'email' => $request->email,
                'region' => $request->region,
                'zone' => $request->zone,
                'wereda' => $request->wereda,
                'password' => Hash::make($request->password),
                'license_number' => $request->licenseNumber,
                'driver_license_path' => $driverLicensePath,
            ]);

            // Store optional car files
            $carOwnershipPath = $request->file('carOwnership')?->store('car_ownerships');
            $carBolloPath = $request->file('carBollo')?->store('car_bollos');

            // Create car
            $car = Car::create([
                'driver_id' => $driver->id,
                'plate_number' => $request->carPlateNumber,
                'vin' => $request->vin,
                'model' => $request->carModel,
                'chasis_number' => $request->ChasisNumber,
                'car_ownership_path' => $carOwnershipPath,
                'car_bollo_path' => $carBolloPath,
            ]);

            return response()->json([
                'message' => 'Driver and Car registered successfully',
                'driver' => $driver,
                'car' => $car
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
