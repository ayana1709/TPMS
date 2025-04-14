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
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logged out successfully'
    ], 200);
});

//Routes for storing the regions, zones and weredas data

Route::get('/fetch-regions', [OSMController::class, 'fetchRegions']);
Route::get('/fetch-zones/{regionOsmId}', [OSMController::class, 'fetchZones']);
Route::get('/fetch-woredas/{zoneOsmId}', [OSMController::class, 'fetchTowns']);

//Route for registering managers
Route::post('/managers', [ManagerController::class, 'store']);
Route::post('/managers/{username}/send-info', [ManagerController::class, 'sendInfoEmail']);
Route::get('/managers', [ManagerController::class, 'index']);
Route::put('/managers/{username}', [ManagerController::class, 'update']);
Route::delete('/managers/{username}', [ManagerController::class, 'destroy']);
Route::post('/managers/login', [ManagerController::class, 'login']);
// Route::post('/managers/update-credentials', [ManagerController::class, 'updateCredentials']);
Route::middleware('auth:sanctum')->post('/managers/update-credentials', [ManagerController::class, 'updateCredentials']);
// Route::middleware('auth:manager')->post('/request-activation', [ManagerController::class, 'requestActivation']);
// from manager to  admin 
Route::post('/managers/request-activation/{username}', [ManagerController::class, 'requestActivation']);
Route::get('/admin/pending-activations', [ManagerController::class, 'getPendingActivations']);
Route::post('/admin/activate-manager/{username}', [ManagerController::class, 'activateManager']);
Route::get('/managers/get-pending-activations', [ManagerController::class, 'getPendingActivations']);

Route::post('/managers/activate-manager/{username}', [ManagerController::class, 'activateManager']);








// Route::apiResource('traffic-users', TrafficUserController::class);
Route::get('/traffic-users', [TrafficUserController::class, 'index']);          // List all users
Route::post('/traffic-users', [TrafficUserController::class, 'store']);         // Create new user
Route::get('/traffic-users/{id}', [TrafficUserController::class, 'show']);      // Show single user
Route::put('/traffic-users/{id}', [TrafficUserController::class, 'update']);    // Update user
Route::delete('/traffic-users/{id}', [TrafficUserController::class, 'destroy']);


  

// Route::apiResource('shifts', ShiftController::class);

Route::get('/shifts', [ShiftController::class, 'index']);
Route::post('/shifts', [ShiftController::class, 'store']);
Route::get('/shifts/{shift}', [ShiftController::class, 'show']);
Route::put('/shifts/{shift}', [ShiftController::class, 'update']);
Route::delete('/shifts/{shift}', [ShiftController::class, 'destroy']);



Route::apiResource('checkpoints', CheckpointController::class);
Route::post('/checkpoints', [CheckpointController::class, 'store']);

