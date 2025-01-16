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
            $table->string('name');
            $table->string('store_name')->unique();
            $table->string('store_category');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('address')->unique();
            $table->string('phone')->unique();
            $table->string('photo')->nullable();
            $table->string('role')->default('Owner');
            $table->timestamps();
        });
        Schema::create('supervisors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('role');
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Suppliers Table
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone_number');
            $table->text('address')->nullable();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Brands Table
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Products Table
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique();
            $table->foreignId('brand_id')->nullable()->constrained('brands')->nullOnDelete(); // Link to brands
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('stock');
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Orders Table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('suppliers_id')->constrained('suppliers')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->integer('quantity');
            $table->decimal('total_price', 8, 2)->default(0);
            $table->string('status')->default('Pending');  
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('supervisors');
    }
};
