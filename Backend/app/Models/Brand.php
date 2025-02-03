<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Store;
use App\Models\Product;
use App\Models\Supplier;
class Brand extends Model
{
    protected $fillable = [
        'name',
        'store_id'
    ];
    
    public function store(){
        return $this->belongsTo(Store::class);
    }
    public function product(){
        return $this->hasMany(Product::class);
    }

    public function supplier(){
        return $this->hasMany(Supplier::class);
    }
}
