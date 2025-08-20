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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('sku')->unique();
            $table->string('name')->nullable(); // Tên biến thể: "Áo thun nam đỏ XL"
            $table->decimal('price', 10, 2)->nullable(); // Giá riêng cho biến thể (nếu khác giá gốc)
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->integer('weight')->nullable(); // Trọng lượng (gram)
            $table->decimal('width', 8, 2)->nullable(); // Chiều rộng (cm)
            $table->decimal('height', 8, 2)->nullable(); // Chiều cao (cm)
            $table->decimal('length', 8, 2)->nullable(); // Chiều dài (cm)
            $table->boolean('is_active')->default(true);
            $table->json('attribute_combination')->nullable(); // Lưu tổ hợp thuộc tính: {"color": "red", "size": "XL"}
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->index(['product_id', 'is_active'], 'variants_product_active');
            $table->index(['sku'], 'variants_sku');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
