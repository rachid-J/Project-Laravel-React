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

        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
  
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone_number');
            $table->text('address')->nullable();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete(); // Add brand_id foreign key
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->foreignId('brand_id')->nullable()->constrained('brands')->cascadeOnDelete();
            $table->foreignId('suppliers_id')->constrained('suppliers')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->integer('quantity');
            $table->string('status')->default('Available');  
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->string('brand_name');
            $table->foreignId('suppliers_id')->constrained('suppliers')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->integer('quantity');
            $table->decimal('total_price', 10, 2)->default(0);
            $table->string('status')->default('Pending');  
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone_number');
            $table->text('address')->nullable();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sells', function (Blueprint $table) {
            $table->id(); // Auto-increment ID
            $table->foreignId('product_id')->constrained()->onDelete('cascade'); // Link to products
            $table->foreignId('customer_id')->constrained()->onDelete('cascade'); // Link to customers
            $table->foreignId('store_id')->constrained("stores")->cascadeOnDelete(); // Link to stores
            $table->integer('quantity'); // Number of items sold
            $table->decimal('total_price', 10, 2);
            $table->string('status')->default('pending');
            $table->timestamps(); // Created_at & Updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sells');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('stores');
    }
};
