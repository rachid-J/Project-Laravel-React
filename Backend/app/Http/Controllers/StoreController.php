<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRequest;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use App\Notifications\UserNotification;

class StoreController extends Controller
{

    public function update(Request $request, $id)
    {
        // Find the store
        $store = Store::find($id);

        if (!$store) {
            return response()->json([
                'message' => 'Store not found'
            ], 404);
        }

        // Validate the request
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'store_name' => 'sometimes|string|max:255',
            'store_category' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:stores,email,' . $id,
            'address' => 'sometimes|string|max:500',
            'phone' => 'sometimes|string|max:20',
            'photo' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete the old photo if it exists
            if ($store->photo && Storage::exists($store->photo)) {
                Storage::delete($store->photo);
            }

            // Store the new photo
            $path = $request->file('photo')->store('profile', 'public');
            $validated['photo'] = $path;
        }

        // Update the store
        foreach ($validated as $key => $value) {
            $store->$key = $value;
        }
        $store->save();

        // Send notification
        $store->notify(new UserNotification('Your store settings have been updated.'));

        return response()->json([
            'message' => 'Settings updated successfully',
            'store' => $store
        ]);
    }
    

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $store = auth('store')->user();

        if (!$store) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        return response()->json([
            'stock' => $store
        ], 200);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create(StoreRequest $request)
    {

        $validatedData = $request->validated();

        if ($request->hasFile("photo")) {
            $path = $request->file("photo")->store("profile", "public");
            $validatedData["photo"] = $path;
        }
        // Create the store
        $store = Store::create([
            ...$validatedData,
            'password' => Hash::make($validatedData['password']), // Encrypt password
        ]);

        // Authenticate the store and generate JWT token
        $token = auth('store')->attempt($request->only('email', 'password'));

        if (!$token) {
            return response(["message" => "Unauthorized"], 401);
        }

        // Send notification
        $store->notify(new UserNotification('Your store has been created successfully.'));

        return response([
            "message" => "Store created successfully",
            "store" => $store,
            "token" => $token,
        ], 201);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function login(Request $request)
    {
        $data = $request->only("email", "password");
        
        if (!$token = auth("store")->attempt($data)) {
            return response([
                "message" => "error unauthorized"
            ], 401);
        }
        ;
        $stock = auth("store")->user();

        return response([
            "token" => $token,
            "stock" => $stock
        ]);

    }




    /**
     * Display the specified resource.
     */
    public function logout(Request $request)
    {
        try {
            $token = JWTAuth::getToken();
            if (!$token) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token not provided'
                ], 400);
            }


            JWTAuth::invalidate($token);

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully logged out'
            ], 200);
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to log out',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

}
