<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Product;

class ProductController extends Controller
{
    public function add(Request $request)
    {
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }

        $validatedData = $request->validate([
            "name" => "required|string|max:255",
            "sku" => "required|string|unique:products,sku",
            "brand_id" => "required|exists:brands,id",
            "description" => "nullable|string",
            "price" => "required|numeric|min:0",
            "stock" => "required|integer|min:0",
        ]);
        $validatedData["store_id"] = $store->id;

        $product = Product::create($validatedData);

        return response()->json([
            "message" => "Product added successfully",
            "product" => $product,
        ], 201);
    }

    
    public function update(Request $request, $id)
{
    $product = Product::findOrFail($id);
    $store = auth("store")->user();
    if (!$store) {
        return response()->json([
            "message" => "Unauthorized: You do not own this store.",
        ], 401);
    }
    $validatedData = $request->validate([
        "name" => "sometimes|string|max:255",
        "sku" => "sometimes|string|unique:products,sku,". $product->id,
        "brand_id" => "sometimes|exists:brands,id" ,
        "description" => "nullable|string",
        "price" => "sometimes|numeric|min:0",
        "stock" => "sometimes|integer|min:0",
        "store_id" => "sometimes"
    ]);

    $product->update($validatedData);

    return response()->json([
        "message" => "Product updated successfully",
        "product" => $product,
    ], 200);
}

    
public function delete($id)
{
    $product = Product::findOrFail($id);
    $store = auth('store')->user();
    if (!$store) {
        return response()->json([
            "message" => "Unauthorized: You do not own this store.",
        ], 401);
    }

    $product->delete();

    return response()->json([
        "message" => "Product deleted successfully",
    ], 200);
}

public function show()
{
    $storeId = auth('store')->id();
    $products = Product::where('store_id', $storeId)->get();
    return response()->json([
        "message" => "Products retrieved successfully",
        "products" => $products,
    ], 200);
}

public function list()
    {
        try {
            $products = Product::with('brand')->paginate(10); // Include brand relationship
            return response()->json($products, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch products.'], 500);
        }
    }
}
