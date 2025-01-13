<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRequest;
use Illuminate\Support\Facades\Hash;

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
    public function createStore(StoreRequest $request)
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
        $user = Store::where("email",$request->input("email"))->first();

        if(!$user){
            return response()->json(["message" => "user not found"]);
        }

        if(!$user->password === $request->input("password")){
            return response()->json(["message" => "wrong password"],401);
        }

        $token = $user -> createToken("auth_token");

        return response()->json(["token" => $token->plainTextToken]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store)
    {
        //
    }

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
