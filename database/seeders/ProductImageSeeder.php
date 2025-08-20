<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ảnh cho sản phẩm (level product)
        $productImages = [];

        // Sản phẩm 1..4 từ ProductSeeder
        foreach ([
            1 => 'ao-thun-nam-co-ban',
            2 => 'ao-so-mi-nam-cong-so',
            3 => 'quan-jean-nam-slim-fit',
            4 => 'quan-short-nam-the-thao',
        ] as $productId => $slug) {
            // 3 ảnh/ sản phẩm, ảnh đầu là primary
            for ($i = 1; $i <= 3; $i++) {
                $productImages[] = [
                    'product_id' => $productId,
                    'product_variant_id' => null,
                    'image_path' => "https://picsum.photos/seed/{$slug}-{$i}/800/800",
                    'alt_text' => "{$slug} image {$i}",
                    'title' => ucfirst(str_replace('-', ' ', $slug)) . " #{$i}",
                    'sort_order' => $i,
                    'is_primary' => $i === 1,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Ảnh cho biến thể (level variant) - các variant 1..6 thuộc product_id = 1 (theo ProductVariantSeeder)
        $variantImages = [];
        for ($variantId = 1; $variantId <= 6; $variantId++) {
            for ($i = 1; $i <= 2; $i++) {
                $variantImages[] = [
                    'product_id' => 1,
                    'product_variant_id' => $variantId,
                    'image_path' => "https://picsum.photos/seed/variant-{$variantId}-{$i}/800/800",
                    'alt_text' => "variant {$variantId} image {$i}",
                    'title' => "Variant {$variantId} #{$i}",
                    'sort_order' => $i,
                    'is_primary' => $i === 1,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('product_images')->insert(array_merge($productImages, $variantImages));
    }
}


