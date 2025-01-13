<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => "required|string|min:3",
            'store_name' => 'required|string|max:255|unique:stores,store_name',
            'store_category' => 'required|string|max:255',
            'email' => "required|email|unique:stores,email",
            'password' => 'required|string|confirmed|min:8',
            'address' => 'required|string|max:255|unique:stores,address',
            'phone' => 'required|regex:/^[0-9]{10,15}$/|unique:stores,phone',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'role' => 'nullable|string'
        ];
    }
}
