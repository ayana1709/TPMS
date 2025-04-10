<?php

use Illuminate\Support\Facades\Route;
use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


WebSocketsRouter::webSocket('/app/{appKey}', \BeyondCode\LaravelWebSockets\WebSockets\WebSocketHandler::class);


// use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;

// WebSocketsRouter::webSocket('/app/{appKey}', \BeyondCode\LaravelWebSockets\Server\WebSocketHandler::class);

Route::get('/', function () {
    return view('welcome');
});  



