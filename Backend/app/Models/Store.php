<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\SuperVisor;
use App\Models\Supplier;
use App\Models\Brand;
use App\Models\Order;
use App\Models\Product;

class Store extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'store_name',
        'store_category',
        'email',
        'password',
        'address',
        'phone',
        'photo',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token', 
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function supervisors()
    {
        return $this->hasMany(SuperVisor::class);
    }

    public function suppliers()
    {
        return $this->hasMany(Supplier::class);
    }

    public function brands()
    {
        return $this->hasMany(Brand::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    
    public function product()
    {
        return $this->hasMany(Product::class);
    }

    public function sell()
    {
        return $this->hasMany(Sell::class);
    }
}


