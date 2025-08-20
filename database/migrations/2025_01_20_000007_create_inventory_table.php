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
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_variant_id')->unique();
            $table->integer('quantity')->default(0);
            $table->integer('reserved_quantity')->default(0); // Số lượng đã đặt hàng
            $table->integer('available_quantity')->default(0); // Số lượng có sẵn = quantity - reserved_quantity
            $table->integer('low_stock_threshold')->default(10); // Ngưỡng cảnh báo hết hàng
            $table->boolean('is_in_stock')->default(true);
            $table->boolean('is_backorder_allowed')->default(false); // Cho phép đặt hàng trước
            $table->timestamp('last_restocked_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_variant_id')->references('id')->on('product_variants')->onDelete('cascade');
            $table->index(['is_in_stock', 'available_quantity'], 'inventory_stock_available');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
