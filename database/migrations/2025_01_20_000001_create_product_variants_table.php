<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('size')->nullable(); // S, M, L, XL
            $table->string('color')->nullable(); // Đỏ, xanh, đen, trắng
            $table->string('material')->nullable(); // Cotton, Polyester, Silk
            $table->decimal('price_adjustment', 8, 2)->default(0); // Điều chỉnh giá
            $table->integer('stock')->default(0);
            $table->string('sku')->unique(); // Mã sản phẩm
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
