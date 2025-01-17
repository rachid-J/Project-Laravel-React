<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Store;
use App\Models\Product;

class Brand extends Model
{
    protected $fillable = [
        'name',
        'store_id'
    ];
    
    public function store (){
        return $this->belongTo(Store::class);
    }
    public function products(){
        return $this->hasMany(Product::class);
    }

    
}
