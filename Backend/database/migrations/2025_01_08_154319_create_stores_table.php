<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('FullName');
            $table->string('StoreName')->unique();
            $table->string('StroyCategory');
            $table->string('Email')->unique();
            $table->string('Password');
            $table->string('Phone')->unique();
            $table->string('Address')->unique();
            $table->string('Photo')->nullable();
            $table->string('role')->default('owner');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
