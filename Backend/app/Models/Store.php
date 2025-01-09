<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\Store as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Store extends Model
{
<<<<<<< HEAD
    use HasFactory, Notifiable;

=======
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
    ];
>>>>>>> e554b43782ab4347de8307b5c9711fb546c01d74
}
