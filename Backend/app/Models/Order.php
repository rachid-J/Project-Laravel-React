<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Store;

class Order extends Model
{
    protected $fillable = [
        'product_id',
        'suppliers_id',
        'store_id',
        'quantity',
        'total_price',
        'status'
    ];

    public function product(){
        return $this->belongTo(Product::class);
    }

    public function supplier(){
        return $this->belongsTo(Supplier::class);
    }

    public function store(){
        return $this->belongsTo(Store::class);
    }

    
}