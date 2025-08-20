<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Áo Nam',
                'slug' => 'ao-nam',
                'description' => 'Các loại áo dành cho nam giới',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Áo Nữ',
                'slug' => 'ao-nu',
                'description' => 'Các loại áo dành cho nữ giới',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Quần Nam',
                'slug' => 'quan-nam',
                'description' => 'Các loại quần dành cho nam giới',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Quần Nữ',
                'slug' => 'quan-nu',
                'description' => 'Các loại quần dành cho nữ giới',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Áo Thun',
                'slug' => 'ao-thun',
                'description' => 'Áo thun nam nữ các loại',
                'parent_id' => 1, // Áo Nam
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Áo Sơ Mi',
                'slug' => 'ao-so-mi',
                'description' => 'Áo sơ mi nam nữ các loại',
                'parent_id' => 1, // Áo Nam
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Quần Jean',
                'slug' => 'quan-jean',
                'description' => 'Quần jean nam nữ các loại',
                'parent_id' => 3, // Quần Nam
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Quần Short',
                'slug' => 'quan-short',
                'description' => 'Quần short nam nữ các loại',
                'parent_id' => 3, // Quần Nam
                'sort_order' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert(array_merge($category, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
