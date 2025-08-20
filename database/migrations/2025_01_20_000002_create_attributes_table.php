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
        Schema::create('attributes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Tên thuộc tính: Color, Size, Material
            $table->string('code')->unique(); // Mã thuộc tính: color, size, material
            $table->text('description')->nullable();
            $table->string('type')->default('select'); // Loại thuộc tính: 'select' (chọn từ danh sách), 'text' (chuỗi), 'number' (số), 'boolean' (đúng/sai)
            $table->boolean('is_required')->default(false); // Thuộc tính này có bắt buộc nhập không (true: bắt buộc, false: không bắt buộc)
            $table->boolean('is_filterable')->default(true); // Có cho phép dùng thuộc tính này để lọc sản phẩm không (true: cho phép lọc, false: không)
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['code', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attributes');
    }
};
