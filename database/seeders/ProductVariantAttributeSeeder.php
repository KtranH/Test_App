<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductVariantAttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Liên kết biến thể với thuộc tính
        $variantAttributes = [
            // Áo thun nam cơ bản - Đen - S (variant_id = 1)
            ['product_variant_id' => 1, 'attribute_id' => 1, 'attribute_value_id' => 1], // Màu đen
            ['product_variant_id' => 1, 'attribute_id' => 2, 'attribute_value_id' => 2], // Kích cỡ S
            
            // Áo thun nam cơ bản - Đen - M (variant_id = 2)
            ['product_variant_id' => 2, 'attribute_id' => 1, 'attribute_value_id' => 1], // Màu đen
            ['product_variant_id' => 2, 'attribute_id' => 2, 'attribute_value_id' => 3], // Kích cỡ M
            
            // Áo thun nam cơ bản - Đen - L (variant_id = 3)
            ['product_variant_id' => 3, 'attribute_id' => 1, 'attribute_value_id' => 1], // Màu đen
            ['product_variant_id' => 3, 'attribute_id' => 2, 'attribute_value_id' => 4], // Kích cỡ L
            
            // Áo thun nam cơ bản - Trắng - S (variant_id = 4)
            ['product_variant_id' => 4, 'attribute_id' => 1, 'attribute_value_id' => 2], // Màu trắng
            ['product_variant_id' => 4, 'attribute_id' => 2, 'attribute_value_id' => 2], // Kích cỡ S
            
            // Áo thun nam cơ bản - Trắng - M (variant_id = 5)
            ['product_variant_id' => 5, 'attribute_id' => 1, 'attribute_value_id' => 2], // Màu trắng
            ['product_variant_id' => 5, 'attribute_id' => 2, 'attribute_value_id' => 3], // Kích cỡ M
            
            // Áo thun nam cơ bản - Trắng - L (variant_id = 6)
            ['product_variant_id' => 6, 'attribute_id' => 1, 'attribute_value_id' => 2], // Màu trắng
            ['product_variant_id' => 6, 'attribute_id' => 2, 'attribute_value_id' => 4], // Kích cỡ L
        ];

        foreach ($variantAttributes as $variantAttribute) {
            DB::table('product_variant_attributes')->insert(array_merge($variantAttribute, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
