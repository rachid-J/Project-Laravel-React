<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomersController extends Controller
{
    // Show all customers
    public function index()
    {
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        try {
            $customers = Customer::all();
            return response()->json(['data' => $customers], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch customers', 'message' => $e->getMessage()], 500);
        }
    }

    // Store a new customer
    public function store(Request $request)
    {
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'phone_number' => 'required|string|max:15',
            'address' => 'required|string',
        ]);
        $validated['store_id'] = $store->id;
       
        $customer = Customer::create($validated);
            
        return response()->json($customer, 201);
    }

    // Update an existing customer
    public function update(Request $request, $id)
    {
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }

        $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:customers,email,' . $id,
            'phone_number' => 'string|max:15',
            'address' => 'string',
        ]);

        try {
            $customer = Customer::findOrFail($id);
            $customer->update($request->all());
            return response()->json(['message' => 'Customer updated successfully', 'data' => $customer], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update customer', 'message' => $e->getMessage()], 500);
        }
    }

    // Delete a customer
    public function destroy($id)
    {
        $store = auth("store")->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }

        try {
            $customer = Customer::findOrFail($id);
            $customer->delete();
            return response()->json(['message' => 'Customer deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete customer', 'message' => $e->getMessage()], 500);
        }
    }
}

