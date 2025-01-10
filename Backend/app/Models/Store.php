<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Store extends Authenticatable implements JWTSubject

{
    use HasFactory, Notifiable;
    protected $table = "stores"; 

    protected $fillable = [
        'name',
        'store_name',
        'store_category',
        'email',
        'password',
        'address',
        'phone',
        // 'photo',
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

    /**
     * Return a key-value array of any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

}

