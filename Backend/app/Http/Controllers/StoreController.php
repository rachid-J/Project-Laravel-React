<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRequest;

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
        $validationRequest = $request->validated();
        Store::create($validationRequest); 
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
