<?php

use App\Http\Controllers\Auth\LoginRegisterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\OSMController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\TrafficUserController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\CheckpointController;
use App\Http\Controllers\ShiftAssignmentController;
use App\Http\Controllers\TrafficLawController;
use App\Http\Controllers\ViolationController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\DriverRegistrationController;
use App\Http\Controllers\CheackerController;
use App\Models\Driver;

// use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/login', [LoginRegisterController::class, 'login']);



Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    // Delete the current access token
    $request->user()->currentAccessToken()->delete();

    // Return a proper JSON response
    return response()->json([
        'message' => 'Logged out successfully'
    ], 200);
});





//Routes for storing the regions, zones and weredas data
Route::get('/fetch-regions', [OSMController::class, 'fetchRegions']);
Route::get('/fetch-zones/{regionOsmId}', [OSMController::class, 'fetchZones']);
Route::get('/fetch-woredas/{zoneOsmId}', [OSMController::class, 'fetchTowns']);



//  ------Manager Routes --------


//Route for registering managers from admin side
Route::post('/managers', [ManagerController::class, 'store']); //store
Route::post('/managers/{username}/send-info', [ManagerController::class, 'sendInfoEmail']); //send email
Route::get('/managers', [ManagerController::class, 'index']);  // list all managers
Route::put('/managers/{username}', [ManagerController::class, 'update']); // update
Route::delete('/managers/{username}', [ManagerController::class, 'destroy']); // delete


// ----login from manager  side -----
Route::middleware('guest')->post('/managers/login', [ManagerController::class, 'login']); // login
Route::middleware('auth:sanctum')->post('/managers/logout', [ManagerController::class, 'logout']); //logout
Route::middleware('auth:sanctum')->get('/managers/me', function (Request $request) {
    return response()->json($request->user());
});

//after login 
Route::middleware('auth:sanctum')->post('/managers/update-credentials', [ManagerController::class, 'updateCredentials']); //  update its password  after login 
Route::post('/managers/request-activation/{username}', [ManagerController::class, 'requestActivation']); // request activation  from admin
Route::get('/managers/status/{username}', [ManagerController::class, 'checkStatus']); // cheack status of the manager

// admin side
Route::get('/admin/pending-activations', [ManagerController::class, 'getPendingActivations']);  // admin get all pending activations
Route::post('/admin/activate/{username}', [ManagerController::class, 'activate']);// admin activate  manager 
Route::delete('/admin/delete/{username}', [ManagerController::class, 'deny']); // admin deny activation request


// ---- traffic user controller 

// Route for registering traffic user from managers side 
// Route::get('/traffic-users', [TrafficUserController::class, 'index']);          // List all users
// Route::post('/traffic-users', [TrafficUserController::class, 'store']);         // Create new user
Route::middleware('auth:sanctum')->post('/traffic-users', [TrafficUserController::class, 'store']);
Route::middleware(['auth:sanctum'])->get('/traffic-users', [TrafficUserController::class, 'index']);

// Traffic user login route
Route::post('/traffic-user/login', [TrafficUserController::class, 'login']);

Route::get('/traffic-users/{id}', [TrafficUserController::class, 'show']);      // Show single user
Route::put('/traffic-users/{id}', [TrafficUserController::class, 'update']);    // Update user
Route::delete('/traffic-users/{id}', [TrafficUserController::class, 'destroy']);

// Traffic user logout route
Route::middleware('auth:sanctum')->post('/traffic-user/logout', [TrafficUserController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/traffic-user/me', function (Request $request) {
    return response()->json($request->user());
});
// after Login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/traffic/update-credentials', [TrafficUserController::class, 'updateCredentials']);
    Route::post('/traffic/request-activation/{username}', [TrafficUserController::class, 'requestActivation']); 
});  











Route::get('/manager/pending-activations', [TrafficUserController::class, 'getPendingActivations']);  //manger get all pending activations from traffic
Route::post('/manager/activate/{username}', [TrafficUserController::class, 'activate']);// admin activate  manager 
Route::delete('/manager/delete/{username}', [TrafficUserController::class, 'deny']); // admin deny activation request
Route::get('/check-activation-status/{username}', [TrafficUserController::class, 'checkActivationStatus']);




// -------shift----

// Route::apiResource('shifts', ShiftController::class);

Route::middleware(['auth:sanctum'])->get('/shifts', [ShiftController::class, 'index']);
Route::post('/shifts', [ShiftController::class, 'store']);
Route::get('/shifts/{shift}', [ShiftController::class, 'show']);
Route::put('/shifts/{shift}', [ShiftController::class, 'update']);
Route::delete('/shifts/{shift}', [ShiftController::class, 'destroy']);



// Route::apiResource('checkpoints', CheckpointController::class);
Route::post('/checkpoints', [CheckpointController::class, 'store']);
Route::middleware(['auth:sanctum'])->get('/checkpoints', [CheckpointController::class, 'index']);
Route::get('/shift-assignments/by-shift/{shiftId}', [ShiftAssignmentController::class, 'getByShiftId']);
Route::get('/assigned-traffic-users', [ShiftAssignmentController::class, 'getAssignedTrafficUsers']);
Route::get('/assigned-traffic-users-for-checkpoint', [ShiftAssignmentController::class, 'getAssignedTrafficUsersForCheckpoint']);

// view shift and location from the  traffic side 
// Route::middleware(['auth:traffic_user'])->get('/traffic-user/assignments', [ShiftAssignmentController::class, 'getMyAssignments']);
// Route::middleware(['auth:traffic'])->group(function () {
// });
// Route::get('/traffic-user/assignments', [ShiftAssignmentController::class, 'getMyAssignments']);
Route::get('/assignments/by-user', [ShiftAssignmentController::class, 'getAssignmentsByUser']);







// Traffic laws routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/import-violations', [ViolationController::class, 'import']);
    Route::get('/violations', [ViolationController::class, 'index']);
    Route::get('/violations/code/{code}', [ViolationController::class, 'getByCode']);
    Route::get('/violations/search', [ViolationController::class, 'searchByName']);


});
// Assigning shifts andd cheackpoints to traffic users 
Route::post('/assign-shift', [ShiftAssignmentController::class, 'store']);
Route::post('/shift-assignments/bulk', [ShiftAssignmentController::class, 'storeBulk']);
Route::get('/shift-assignments', [ShiftAssignmentController::class, 'index']);










//violation routes and  payement for penalty routes

Route::middleware( 'auth:sanctum')->group(function () {
    Route::post('/violations', [ViolationController::class, 'issue']);
    Route::get('/violations', [ViolationController::class, 'index']);
    Route::post('/violations/pay', [ViolationController::class, 'pay']);
});



// Driver Registration Routes 

Route::post('/register-driver', [DriverRegistrationController::class, 'store']);
Route::get('/drivers', [DriverRegistrationController::class, 'index']);
Route::get('/drivers/{id}', [DriverRegistrationController::class, 'show']);
Route::put('/drivers/{id}', [DriverRegistrationController::class, 'update']);
Route::delete('/drivers/{id}', [DriverRegistrationController::class, 'destroy']);
Route::patch('/drivers/{id}/approve', [DriverRegistrationController::class, 'approve']);
Route::patch('/drivers/{id}/reject', [DriverRegistrationController::class, 'reject']);
Route::get('/drivers/{id}/status', [DriverRegistrationController::class, 'checkStatus']);
Route::post('/driver-login', [DriverRegistrationController::class, 'driverLogin']);


Route::post('/driver-login', [DriverRegistrationController::class, 'driverLogin']);
Route::middleware('auth:sanctum')->post('/logout', [DriverRegistrationController::class, 'logout']);




Route::prefix('cheackers')->group(function () {
    Route::get('/', [CheackerController::class, 'index']);            // List all cheackers
    Route::post('/', [CheackerController::class, 'store']);           // Create new cheacker
    Route::get('/{id}', [CheackerController::class, 'show']);         // Get single cheacker
    Route::put('/{id}', [CheackerController::class, 'update']);       // Update cheacker
    Route::delete('/{id}', [CheackerController::class, 'destroy']);   // Delete cheacker
});
Route::post('/cheacker/login', [CheackerController::class, 'login']);


//test for driver authentication 
Route::post('/driver-authenticate', function (Request $request) {
    $driver = Driver::find($request->driver_id);

    if (!$driver || $driver->status !== 'active') {
        return response()->json(['message' => 'Not approved'], 403);
    }

    // return Sanctum token
    $token = $driver->createToken('driver_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'driver_id' => $driver->id
    ]);
});

// Fine routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/fines', [FineController::class, 'store']);
    Route::get('/fines/{id}', [FineController::class, 'show']);
    Route::post('/fines/mark-paid', [FineController::class, 'markAsPaid']);
});
    Route::get('/fines', [FineController::class, 'index']);
    Route::get('/fines/driver/{license}', [FineController::class, 'getByDriver']);
