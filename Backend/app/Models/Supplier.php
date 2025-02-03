<?php

namespace App\Models;
use App\Models\Store;
use App\Models\Order;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'address',
        'brand_id',
        'store_id'
    ] ;
    
    public function store(){
        return $this->belongsTo(Store::class);
    }

    public function orders(){
        return $this->hasMany(Order::class);
    }

    public function brand(){
        return $this->belongsTo(Brand::class);
    }

    
}
