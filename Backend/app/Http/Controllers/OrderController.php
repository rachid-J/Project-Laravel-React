<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Order;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Store;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Fetch all orders with relationships
    public function index()
    {
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        $orders = Order::with(relations: ['suppliers', 'store'])->get();
        return response()->json($orders);
    }

    public function paye(Request $request, $id)
{
    $store = auth("store")->user();
    if (!$store) {
        return response()->json(["message" => "Unauthorized: You do not own this store."], 401);
    }

    $order = Order::findOrFail($id);
    $brand = Brand::where('name', $order->brand_name)->first();
    if($order->status == "Paid"){
        return response()->json(["message" => "Order already paid."], 400);
    }

    if($order->status == "Cancelled"){
        return response()->json(["message" => "Order already Cancelled."], 400);
    }

    if (!$brand) {
        return response()->json(["message" => "Brand not found."], 404);
    }

    // Try to find the product
    $product = Product::where('id', $order->product_id)->first();

    // If product doesn't exist, create it
    if (!$product) {
        $product = Product::create([
            "product_name" => $order->product_name,
            "brand_id" => $brand->id,
            "suppliers_id" => $order->suppliers_id,
            "store_id" => $order->store_id,
            "price" => $order->price,
            "quantity" => $order->quantity,
        ]);
    } else {
        // Update the product quantity
        $product->quantity += $order->quantity;
        $product->save();
    }

    $order->status = 'Paid';
    $order->save();

    return response()->json($order);
}


    public function cancel(Request $request){
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        $orders = Order::findOrFail($request->id);
        if($orders->status === "Cancelled" || $orders->status === "Paid"){
            return response()->json(["message" => "Order already Cancelled."], 400);
        }
    
            $orders->status = 'Cancelled';
            $orders->save();

        
        return response()->json($orders);
    }



        

        
    
    


    // Store a new order
    public function store(Request $request)
    {
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        // Validate the incoming request
        $validated = $request->validate([
            'brand_name' => 'required|string|max:30',
            'product_id' => 'nullable|integer',
            'product_name' => 'required|string|max:30',
            'suppliers_id' => 'required|exists:suppliers,id',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
        ]);
        
        $validated['store_id'] = $store->id;
        $validated['total_price'] = $validated['price'] * $validated['quantity'];

        // Create the order
        $order = Order::create($validated);

        // Return the newly created order as a JSON response
        return response()->json($order, 201); // 201 for resource creation
    }
    

    // Delete an order
    public function destroy(Order $order)
    {
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        // Delete the order
        $order->delete();

        // Return a success message
        return response()->json(['message' => 'Order deleted successfully']);
    }
}
