<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Product;
use App\Models\Sell;

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
        $store = auth('store')->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
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

    public function sale(Request $request)
    {
        $store = auth('store')->user();
        
        if (!$store || !$store->id) {  // Ensure store is authenticated and has an ID
            return response()->json(["message" => "Unauthorized"], 401);
        }
    
        // Validate incoming request
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);
        $validated['store_id'] = $store->id;  // Ensure store ID is set
    
        // Get the customer
        $customer = Customer::find($validated['customer_id']);
    
        $totalPrice = 0;
    
        foreach ($validated['products'] as $productData) {
            // Find the product
            $product = Product::find($productData['product_id']);
    
            // Check if the product exists
            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }
    
            // Check stock availability
            if ($product->quantity < $productData['quantity']) {
                return response()->json(['message' => 'Not enough stock available for ' . $product->name], 400);
            }
    
            // Create the sale record
            $sell = Sell::create([
                'product_id' => $product->id,
                'customer_id' => $validated['customer_id'],
                "store_id" => $store->id,
                'quantity' => $productData['quantity'],
                'total_price' => $product->price * $productData['quantity'],
                 // Ensure store ID is set
            ]);
    
            // Deduct from product stock
            $product->quantity -= $productData['quantity'];
            $product->save();
    
            // Add to the total price
            $totalPrice += $sell->total_price;
        }
    
        // Return success response
        return response()->json([
            'message' => 'Sale successful',
            'total_price' => $totalPrice,
        ]);
    }
    

    public function showSells()
    {
        try {
            $store = auth('store')->user();
            if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
            // Retrieve all sales records, including related customer and product data
            $sells = Sell::with(['customer', 'product'])->get();

            // Return the sales data in a JSON response
            return response()->json([
                'status' => 'success',
                'data' => $sells
            ], 200);
        } catch (\Exception $e) {
            // Handle any errors (e.g., database connection issues)
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching sales data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show()
    {
        $store = auth('store')->user();
        if ($store) {
            $products = Product::with("store", "brand", "order")->paginate(7);
            return response()->json([
                "message" => "Products retrieved successfully",
                "data" => $products,
            ], 200);
        }
        return response()->json([
            "message" => "Products retrieved unsuccessfully",
        ], 404);
    }


    public function returnSale(Request $request, $id)
    {
        $store = auth('store')->user();
        if (!$store) {
            return response()->json(["message" => "Unauthorized"], 401);
        }
        $sale = Sell::findOrFail($id);
        if (!$sale) {
            return response()->json(['message' => 'Sale not found'], 404);
        }
        if ($sale->status === "Returned") {
            return response()->json(["message" => "Sale already returned"], 400);
        }
        if ($sale->status === "Sold") {
            return response()->json(["message" => "Sale already confirmed"], 400);
        }

        // Restore the sold quantity back to product stock
        $product = Product::find($sale->product_id);
        if ($product) {
            $product->quantity += $sale->quantity;
            $product->save();
        }

        $sale->status = 'Returned';
        $sale->save();

        // Optionally, delete the sale record or mark it as returned


        return response()->json(['message' => 'Sale returned successfully', 'product' => $product]);
    }

    public function confirmSell(Request $request, $id)
    {
        $store = auth('store')->user();
        if (!$store) {
            return response()->json(["message" => "Unauthorized"], 401);
        }

        $sell = Sell::findOrFail($id);
        if ($sell->status === "Sold") {
            return response()->json(["message" => "Sale already confirmed"], 400);
        }
        if ($sell->status === "Returned") {
            return response()->json(["message" => "Sale already returned"], 400);
        }

        $sell->status = "Sold";
        $sell->save();

        return response()->json(["message" => "Sale confirmed successfully", "sell" => $sell], 200);
    }
}
