<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Áo thun nam cơ bản',
                'slug' => 'ao-thun-nam-co-ban',
                'description' => 'Áo thun nam cơ bản với chất liệu cotton 100%, thoáng mát, dễ mặc',
                'short_description' => 'Áo thun nam cotton 100%',
                'category_id' => 5, // Áo Thun
                'brand' => 'Basic Brand',
                'sku' => 'ATN-001',
                'base_price' => 150000,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Áo sơ mi nam công sở',
                'slug' => 'ao-so-mi-nam-cong-so',
                'description' => 'Áo sơ mi nam công sở lịch lãm, phù hợp cho môi trường văn phòng',
                'short_description' => 'Áo sơ mi nam công sở',
                'category_id' => 6, // Áo Sơ Mi
                'brand' => 'Office Style',
                'sku' => 'ASM-001',
                'base_price' => 350000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Quần jean nam slim fit',
                'slug' => 'quan-jean-nam-slim-fit',
                'description' => 'Quần jean nam slim fit với chất liệu denim cao cấp, kiểu dáng hiện đại',
                'short_description' => 'Quần jean nam slim fit',
                'category_id' => 7, // Quần Jean
                'brand' => 'Denim Pro',
                'sku' => 'QJN-001',
                'base_price' => 450000,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Quần short nam thể thao',
                'slug' => 'quan-short-nam-the-thao',
                'description' => 'Quần short nam thể thao với chất liệu thoáng mát, phù hợp cho các hoạt động thể thao',
                'short_description' => 'Quần short nam thể thao',
                'category_id' => 8, // Quần Short
                'brand' => 'Sport Style',
                'sku' => 'QSN-001',
                'base_price' => 120000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->insert(array_merge($product, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
