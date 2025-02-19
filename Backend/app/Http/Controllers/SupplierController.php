<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Store;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    // Fetch all suppliers with associated stores
    public function index()
    {
        $store = auth('store')->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        $suppliers = Supplier::with('store',"brand")->get();
        return response()->json($suppliers);
    }

    // Create a new supplier (API version)
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:suppliers',
            'phone_number' => 'required|string|max:15',
            'address' => 'nullable|string',
            'brand_id' => 'required|exists:brands,id',
        ]);
        $validated['store_id'] = $store->id;
        // Create the new supplier
        $supplier = Supplier::create($validated);

        // Return the newly created supplier as a JSON response
        return response()->json($supplier, 200);  // 201 status for resource created
    }

    // Update an existing supplier
    public function update(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        $validatedData = $request->validate([
            "name" => "sometimes|string|max:255",
            'email' => 'sometimes|unique:suppliers,email,' . $supplier->id,
            'phone_number' => 'nullable|string|max:15',
            'address' => 'nullable|string',
            'brand_id' => 'required|exists:brands,id',
        ]);
        $validatedData['store_id'] = $store->id;
    
        $supplier->update($validatedData);
    
        return response()->json([
            "message" => "Supplier updated successfully",
            "supplier" => $supplier,
        ], 200);
    }

    // Delete a supplier
    public function destroy(Supplier $supplier)
    {
        $store = auth("store")->user();
    
        // Check if the authenticated store exists and owns the supplier
        if (!$store || $supplier->store_id !== $store->id) {
            return response()->json([
                "message" => "Unauthorized: You do not own this supplier.",
            ], 401);
        }
    
        // Delete the supplier
        $supplier->delete();
    
        // Return a success response
        return response()->json(['message' => 'Supplier deleted successfully'], 200);
    }
    
}
