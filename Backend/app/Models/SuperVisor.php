<?php

namespace App\Models;
use App\Models\Store;
use Illuminate\Database\Eloquent\Model;

class SuperVisor extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'store_id'
    ] ;
    
    public function store (){
        return $this->belongTo(Store::class);
    }
    
}
