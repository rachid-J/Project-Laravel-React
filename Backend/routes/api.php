<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;
// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix("store")->group(function ($route) {
    Route::post("/create",[StoreController::class,"create"]);
    Route::post("/login",[StoreController::class,"login"]);

});