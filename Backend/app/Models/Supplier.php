<?php

namespace App\Models;
use App\Models\Store;
use App\Models\Order;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'address',
        'store_id'
    ] ;
    
    public function store (){
        return $this->belongTo(Store::class);
    }

    public function orders(){
        return $this->hasMany(Order::class);
    }

    
}
