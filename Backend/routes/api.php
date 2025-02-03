<?php

use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\SupplierController;

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
    Route::post("/sale/{id}", [ProductController::class, "sale"]);
    Route::get("/show", [ProductController::class, "show"]);
    
});

Route::middleware("auth:store")->prefix("brand")->group(function(){
    Route::post('/create',[BrandController::class,'create']);
    Route::delete('/delete',[BrandController::class,'delete']);
    Route::get('/show',[BrandController::class,'show']);

});


Route::middleware("auth:store")->prefix("supplier")->group(function(){
    Route::get('/show',[SupplierController::class,'index']);
    Route::post('/store',[SupplierController::class,'store']);
    Route::put('/update/{id}',[SupplierController::class,'update']);
    Route::delete('/destroy/{supplier}',[SupplierController::class,'destroy']);
});

Route::middleware("auth:store")->prefix("order")->group(function(){
    Route::get('/show',[OrderController::class,'index']);
    Route::post('/pay/{id}',[OrderController::class,'paye']);
    Route::post('/cancel/{id}',[OrderController::class,'cancel']);
    Route::post('/store',[OrderController::class,'store']);
    Route::put('/update',[OrderController::class,'update']);
    Route::delete('/destroy',[OrderController::class,'destroy']);
});



