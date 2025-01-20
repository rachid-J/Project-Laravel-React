<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRequest;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(StoreRequest $request)
    { 
        
        $validatedData = $request->validated();
        
        if($request->hasFile("photo")){
            $path = $request->file("photo")->store("profile","public");
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
        $data = $request->only("email","password");
        if(!$token = auth("store")->attempt($data)) {
            return response([
                "message" => "error unauthorized"
            ],401);
    };
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
            ],500);
    }}




    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        //
    }
}
