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
    'status' => 'inactive', // explicitly set status here
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

    public function index()
    {
        try {
            // Fetch all drivers with their car info
            $drivers = Driver::with('car')->latest()->get();
    
            // Append full image URLs
            $drivers->transform(function ($driver) {
                $driver->driver_license_path = $driver->driver_license_path
                    ? asset('storage/' . $driver->driver_license_path)
                    : null;
    
                if ($driver->car) {
                    $driver->car->car_ownership_path = $driver->car->car_ownership_path
                        ? asset('storage/' . $driver->car->car_ownership_path)
                        : null;
    
                    $driver->car->car_bollo_path = $driver->car->car_bollo_path
                        ? asset('storage/' . $driver->car->car_bollo_path)
                        : null;
                }
    
                return $driver;
            });
    
            return response()->json([
                'message' => 'Drivers with cars fetched successfully',
                'data' => $drivers,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch driver-car data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
public function show($id)
{
    try {
        $driver = Driver::with('car')->findOrFail($id);

        // Include full URLs for uploaded files
        $driver->driver_license_url = $driver->driver_license_path
            ? Storage::disk('public')->url($driver->driver_license_path)
            : null;

        if ($driver->car) {
            $driver->car->car_ownership_url = $driver->car->car_ownership_path
                ? Storage::disk('public')->url($driver->car->car_ownership_path)
                : null;

            $driver->car->car_bollo_url = $driver->car->car_bollo_path
                ? Storage::disk('public')->url($driver->car->car_bollo_path)
                : null;
        }

        return response()->json([
            'message' => 'Driver details fetched successfully',
            'data' => $driver,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch driver details',
            'error' => $e->getMessage(),
        ], 500);
    }
}

//
public function destroy($id)
    {
        Driver::destroy($id);
        return response()->json(['message' => 'Driver deleted successfully.']);
    }
//

    public function approve($id)
    {
        $driver = Driver::findOrFail($id);
        $driver->status = 'active';
        $driver->save();
        return response()->json(['message' => 'Driver activated.']);
    }

//

    public function reject($id)
    {
        $driver = Driver::findOrFail($id);
        $driver->status = 'inactive';
        $driver->save();
        return response()->json(['message' => 'Driver rejected.']);
    }

    public function checkStatus($id)
{
    try {
        $driver = Driver::findOrFail($id);

        return response()->json([
            'message' => 'Driver status fetched successfully.',
            'status' => $driver->status,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch driver status.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


}
