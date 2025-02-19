<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Sell;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'phone_number', 'address', 'store_id'];

    public function sell(){
        return $this->hasMany(Sell::class);
    }

    
}



