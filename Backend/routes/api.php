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
Route::middleware('auth:store')->prefix('store')->group(function(){
    Route::post('/logout', [StoreController::class, 'logout']);
});



Route::post("/add",[StoreController::class,"add"]);
Route::middleware('auth:store')->group(function(){
    Route::put('/update/{id}', [StoreController::class, 'update']); 
});
Route::get("/show",[StoreController::class,"show"]);
Route::delete("/delete/{id}",[StoreController::class,"delete"]);



