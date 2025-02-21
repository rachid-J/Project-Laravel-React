<?php

use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SupplierController;

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix("store")->group(function ($route) {
    Route::post("/create",[StoreController::class,"create"]);
    Route::post("/login",[StoreController::class,"login"]);
   
});
Route::middleware('auth:store')->prefix('store')->group(function(){
    Route::post("/update/{id}",[StoreController::class,"update"]);
    Route::post('/logout', [StoreController::class, 'logout']);
    Route::get("/index",[StoreController::class,"index"]);
  
});


Route::middleware('auth:store')->prefix("product")->group(function () {
    Route::post("/create", [ProductController::class, "create"]);
    Route::put("/update/{id}", [ProductController::class, "update"]);
    Route::delete("/delete/{id}", [ProductController::class, "delete"]);
    Route::post("/sale", [ProductController::class, "sale"]);
    Route::get("/show", [ProductController::class, "show"]);
    Route::get("/showSells", [ProductController::class, "showSells"]);
    Route::post("/return/{id}", [ProductController::class, "returnSale"]);
    Route::post("/confirm/{id}", [ProductController::class, "confirmSell"]);
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

Route::middleware("auth:store")->prefix("customer")->group(function(){
    Route::get('/show',[CustomersController::class,'index']);
    Route::post('/store',[CustomersController::class,'store']);
    Route::put('/update/{id}',[CustomersController::class,'update']);
    Route::delete('/destroy/{supplier}',[CustomersController::class,'destroy']);
});

Route::middleware("auth:store")->prefix("order")->group(function(){
    Route::get('/show',[OrderController::class,'index']);
    Route::post('/pay/{id}',[OrderController::class,'paye']);
    Route::post('/cancel/{id}',[OrderController::class,'cancel']);
    Route::post('/store',[OrderController::class,'store']);
    Route::put('/update',[OrderController::class,'update']);
    Route::delete('/destroy',[OrderController::class,'destroy']);
});


Route::middleware("auth:store")->prefix("dashboard")->group(function(){
    Route::get('/getdata',[DashboardController::class,'getData']);
    Route::get('/getsellsChart',[DashboardController::class,'getsellsChart']);
    Route::get('/getordersChart',[DashboardController::class,'getOrderschart']);

});



Route::middleware('auth:store')->prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/{id}', [NotificationController::class, 'destroy']);
});