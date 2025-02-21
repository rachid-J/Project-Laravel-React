<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;

class BrandController extends Controller
{
    public function create(Request $request){
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }

        $validation = $request->validate([
            "name" => "string|required"
        ]);
        $validation['store_id'] = $store->id;

        $brand = Brand::create($validation);
        
        return response()->json([
            "message" => "Brand added successfully",
            "brand" => $brand,
        ], 201);
    }

    public function delete(Brand $brand){
        $store = auth('store')->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        $brand->products()->delete();
        $brand->delete();

        return response([
            "message" => "successfully"
        ]);
    }   

    public function show()
    {
        try {
           if( $store = auth('store')->user()) {
                $brands = Brand::where('store_id', $store->id)->with("product")->paginate(10); // Fetch all brands
                return response()->json(["Brands" =>$brands], 200);
           };
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch brands.'], 500);
        }
    }
}
