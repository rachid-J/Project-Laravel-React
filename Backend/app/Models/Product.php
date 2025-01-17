<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Store;
use App\Models\Brand;
use App\Models\Order;


class Product extends Model
{
    protected $fillable = [
        'name',
        'sku',
        'brand_id',
        'description',
        'price',
        'stock',
        'store_id'
    ];

    public function store (){
        return $this->belongTo(Store::class);
    }

    public function brand(){
        return $this->belongsTo(Brand::class);
    }
    public function orders(){
        return $this->hasMany(Order::class);
    }

    
}
