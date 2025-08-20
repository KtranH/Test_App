<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Biến thể cho Áo thun nam cơ bản (product_id = 1)
        $variants = [
            [
                'product_id' => 1,
                'sku' => 'ATN-001-BLACK-S',
                'name' => 'Áo thun nam cơ bản - Đen - S',
                'price' => null, // Sử dụng giá gốc từ bảng products
                'weight' => 150,
                'width' => 45,
                'height' => 65,
                'length' => 70,
                'is_active' => true,
                'attribute_combination' => json_encode(['color' => 'black', 'size' => 's']),
            ],
            [
                'product_id' => 1,
                'sku' => 'ATN-001-BLACK-M',
                'name' => 'Áo thun nam cơ bản - Đen - M',
                'price' => null,
                'weight' => 160,
                'width' => 48,
                'height' => 68,
                'length' => 72,
                'is_active' => true,
                'attribute_combination' => json_encode(['color' => 'black', 'size' => 'm']),
            ],
            [
                'product_id' => 1,
                'sku' => 'ATN-001-BLACK-L',
                'name' => 'Áo thun nam cơ bản - Đen - L',
                'price' => null,
                'weight' => 170,
                'width' => 51,
                'height' => 71,
                'length' => 74,
                'is_active' => true,
                'attribute_combination' => json_encode(['color' => 'black', 'size' => 'l']),
            ],
            [
                'product_id' => 1,
                'sku' => 'ATN-001-WHITE-S',
                'name' => 'Áo thun nam cơ bản - Trắng - S',
                'price' => null,
                'weight' => 150,
                'width' => 45,
                'height' => 65,
                'length' => 70,
                'is_active' => true,
                'attribute_combination' => json_encode(['color' => 'white', 'size' => 's']),
            ],
            [
                'product_id' => 1,
                'sku' => 'ATN-001-WHITE-M',
                'name' => 'Áo thun nam cơ bản - Trắng - M',
                'price' => null,
                'weight' => 160,
                'width' => 48,
                'height' => 68,
                'length' => 72,
                'is_active' => true,
                'attribute_combination' => json_encode(['color' => 'white', 'size' => 'm']),
            ],
            [
                'product_id' => 1,
                'sku' => 'ATN-001-WHITE-L',
                'name' => 'Áo thun nam cơ bản - Trắng - L',
                'price' => null,
                'weight' => 170,
                'width' => 51,
                'height' => 71,
                'length' => 74,
                'is_active' => true,
                'attribute_combination' => json_encode(['color' => 'white', 'size' => 'l']),
            ],
        ];

        foreach ($variants as $variant) {
            DB::table('product_variants')->insert(array_merge($variant, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
