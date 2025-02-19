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
    }
};
