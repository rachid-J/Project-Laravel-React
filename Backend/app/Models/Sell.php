<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;

class Sell extends Model
{
    protected $fillable = ['product_id', 'customer_id', 'store_id', 'quantity', 'total_price', 'status'];

    public function customer(){
        return $this->belongsTo(Customer::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}


