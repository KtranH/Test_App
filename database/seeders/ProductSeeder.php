<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo sản phẩm mẫu
        $products = [
            [
                'name' => 'Áo thun nam basic',
                'description' => 'Áo thun nam chất liệu cotton 100%, thoáng mát, dễ mặc',
                'base_price' => 299000,
                'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                'category' => 'Áo thun',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Quần jean nam slim fit',
                'description' => 'Quần jean nam kiểu dáng slim fit, chất liệu denim cao cấp',
                'base_price' => 899000,
                'image' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
                'category' => 'Quần jean',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($products as $product) {
            $productId = DB::table('products')->insertGetId($product);
            
            // Tạo biến thể cho mỗi sản phẩm
            if ($product['name'] === 'Áo thun nam basic') {
                $variants = [
                    ['size' => 'S', 'color' => 'Đen', 'material' => 'Cotton', 'price_adjustment' => 0, 'stock' => 50, 'sku' => 'ATB-S-D-001'],
                    ['size' => 'M', 'color' => 'Đen', 'material' => 'Cotton', 'price_adjustment' => 0, 'stock' => 75, 'sku' => 'ATB-M-D-002'],
                    ['size' => 'L', 'color' => 'Đen', 'material' => 'Cotton', 'price_adjustment' => 0, 'stock' => 60, 'sku' => 'ATB-L-D-003'],
                    ['size' => 'S', 'color' => 'Trắng', 'material' => 'Cotton', 'price_adjustment' => 0, 'stock' => 45, 'sku' => 'ATB-S-T-004'],
                    ['size' => 'M', 'color' => 'Trắng', 'material' => 'Cotton', 'price_adjustment' => 0, 'stock' => 65, 'sku' => 'ATB-M-T-005'],
                ];
            } else {
                $variants = [
                    ['size' => '30', 'color' => 'Xanh đậm', 'material' => 'Denim', 'price_adjustment' => 0, 'stock' => 30, 'sku' => 'QJN-30-XD-001'],
                    ['size' => '32', 'color' => 'Xanh đậm', 'material' => 'Denim', 'price_adjustment' => 0, 'stock' => 40, 'sku' => 'QJN-32-XD-002'],
                    ['size' => '34', 'color' => 'Xanh đậm', 'material' => 'Denim', 'price_adjustment' => 0, 'stock' => 35, 'sku' => 'QJN-34-XD-003'],
                    ['size' => '30', 'color' => 'Đen', 'material' => 'Denim', 'price_adjustment' => 50000, 'stock' => 25, 'sku' => 'QJN-30-D-004'],
                    ['size' => '32', 'color' => 'Đen', 'material' => 'Denim', 'price_adjustment' => 50000, 'stock' => 30, 'sku' => 'QJN-32-D-005'],
                ];
            }

            foreach ($variants as $variant) {
                DB::table('product_variants')->insert([
                    'product_id' => $productId,
                    'size' => $variant['size'],
                    'color' => $variant['color'],
                    'material' => $variant['material'],
                    'price_adjustment' => $variant['price_adjustment'],
                    'stock' => $variant['stock'],
                    'sku' => $variant['sku'],
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
