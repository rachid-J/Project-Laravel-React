<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Product;

class ProductController extends Controller
{

    public function create(Request $request)
{
    // Get the authenticated store
    $store = auth('store')->user();
    if (!$store) {
        return response()->json(["message" => "Unauthorized"], 401);
    }

    // Validate incoming data
    $validatedData = $request->validate([
        'product_name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'quantity' => 'required|integer|min:1',
    ]);

    // Calculate total price based on price and quantity
    $validatedData['total_price'] = $validatedData['price'] * $validatedData['quantity'];
    $validatedData['store_id'] = $store->id;  // Store the authenticated store ID

    // Create the product
    $product = Product::create($validatedData);

    // Return response
    return response()->json([
        'message' => 'Product created successfully',
        'product' => $product
    ], 201);
}

    public function update(Request $request, $id)
{
    $product = Product::findOrFail($id);
    $store = auth("store")->user();

    if (!$store || $product->store_id !== $store->id) {
        return response()->json(["message" => "Unauthorized"], 401);
    }

    $validatedData = $request->validate([
        "product_name" => "sometimes|string|max:255",
        "price" => "sometimes|numeric|min:0",
        "quantity" => "sometimes|integer|min:1",
    ]);

    // Calculate total price dynamically
    if (isset($validatedData['price']) || isset($validatedData['quantity'])) {
        $validatedData['total_price'] = 
            ($validatedData['price'] ?? $product->price) * 
            ($validatedData['quantity'] ?? $product->quantity);
    }

    $product->update($validatedData);

    return response()->json(["message" => "Product updated", "product" => $product], 200);
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
    $store = auth('store')->user();
    if ($store) {
        $products = Product::with("store", "brand", "order")->paginate(7);
        return response()->json([
            "message" => "Products retrieved successfully",
            "data" => $products, // Ensure the key is 'data' for consistency
        ], 200);
    }
    return response()->json([
        "message" => "Products retrieved unsuccessfully",
    ], 404);
}


}
