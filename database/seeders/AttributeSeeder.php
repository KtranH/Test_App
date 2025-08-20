<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = [
            [
                'name' => 'Màu sắc',
                'code' => 'color',
                'description' => 'Thuộc tính màu sắc của sản phẩm',
                'type' => 'select',
                'is_required' => true,
                'is_filterable' => true,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Kích cỡ',
                'code' => 'size',
                'description' => 'Thuộc tính kích cỡ của sản phẩm',
                'type' => 'select',
                'is_required' => true,
                'is_filterable' => true,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Chất liệu',
                'code' => 'material',
                'description' => 'Thuộc tính chất liệu của sản phẩm',
                'type' => 'select',
                'is_required' => false,
                'is_filterable' => true,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Kiểu dáng',
                'code' => 'style',
                'description' => 'Thuộc tính kiểu dáng của sản phẩm',
                'type' => 'select',
                'is_required' => false,
                'is_filterable' => true,
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($attributes as $attribute) {
            DB::table('attributes')->insert(array_merge($attribute, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
