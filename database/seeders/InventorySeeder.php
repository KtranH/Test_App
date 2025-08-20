<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $inventory = [
            [
                'product_variant_id' => 1, // Áo thun nam cơ bản - Đen - S
                'quantity' => 50,
                'reserved_quantity' => 5,
                'available_quantity' => 45,
                'low_stock_threshold' => 10,
                'is_in_stock' => true,
                'is_backorder_allowed' => false,
                'last_restocked_at' => now(),
            ],
            [
                'product_variant_id' => 2, // Áo thun nam cơ bản - Đen - M
                'quantity' => 75,
                'reserved_quantity' => 8,
                'available_quantity' => 67,
                'low_stock_threshold' => 15,
                'is_in_stock' => true,
                'is_backorder_allowed' => false,
                'last_restocked_at' => now(),
            ],
            [
                'product_variant_id' => 3, // Áo thun nam cơ bản - Đen - L
                'quantity' => 60,
                'reserved_quantity' => 3,
                'available_quantity' => 57,
                'low_stock_threshold' => 12,
                'is_in_stock' => true,
                'is_backorder_allowed' => false,
                'last_restocked_at' => now(),
            ],
            [
                'product_variant_id' => 4, // Áo thun nam cơ bản - Trắng - S
                'quantity' => 45,
                'reserved_quantity' => 6,
                'available_quantity' => 39,
                'low_stock_threshold' => 10,
                'is_in_stock' => true,
                'is_backorder_allowed' => false,
                'last_restocked_at' => now(),
            ],
            [
                'product_variant_id' => 5, // Áo thun nam cơ bản - Trắng - M
                'quantity' => 65,
                'reserved_quantity' => 4,
                'available_quantity' => 61,
                'low_stock_threshold' => 15,
                'is_in_stock' => true,
                'is_backorder_allowed' => false,
                'last_restocked_at' => now(),
            ],
            [
                'product_variant_id' => 6, // Áo thun nam cơ bản - Trắng - L
                'quantity' => 55,
                'reserved_quantity' => 2,
                'available_quantity' => 53,
                'low_stock_threshold' => 12,
                'is_in_stock' => true,
                'is_backorder_allowed' => false,
                'last_restocked_at' => now(),
            ],
        ];

        foreach ($inventory as $item) {
            DB::table('inventory')->insert(array_merge($item, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
