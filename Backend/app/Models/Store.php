<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $fillable = [
        'name',
        'store_name',
        'store_category',
        'email',
        'password',
        'address',
        'phone',
        'photo',
        'role'
    ];

    protected $hidden = [
        'password',
    ];
}
