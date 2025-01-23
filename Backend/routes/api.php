<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;

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

Route::middleware('auth:store')->prefix("product")->group(function () {
    Route::post("/create", [ProductController::class, "create"]);
    Route::put("/update/{id}", [ProductController::class, "update"]);
    Route::delete("/delete/{id}", [ProductController::class, "delete"]);
    Route::get("/show/{id}", [ProductController::class, "show"]);
});

Route::middleware("auth:store")->prefix("brand")->group(function(){
    Route::post('/create',[BrandController::class,'create']);
    Route::delete('/delete',[BrandController::class,'delete']);
});




