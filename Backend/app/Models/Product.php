<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Store;
use App\Models\Supplier;
use App\Models\Order;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'product_name',
        'brand_id',
        'suppliers_id', 
        'store_id',
        'price',
        'quantity',
        'status',
    ];


    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function order()
    {
        return $this->hasMany(Order::class);
    }

    public function brand(){
        return $this->belongsTo(Brand::class);
    }
}
