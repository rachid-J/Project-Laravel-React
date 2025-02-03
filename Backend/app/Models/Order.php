<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Store;

class Order extends Model
{
    protected $fillable = [
        'brand_name',
        'product_name',
        'suppliers_id',
        'store_id',
        'product_id',
        'price',
        'quantity',
        'total_price',
        'status'
    ];



    public function suppliers(){
        return $this->belongsTo(Supplier::class);
    }

    public function store(){
        return $this->belongsTo(Store::class);
    }

    public function products(){
        return $this->belongsTo(Product::class);
    }

    
}