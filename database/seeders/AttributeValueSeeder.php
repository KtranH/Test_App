<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttributeValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Màu sắc (attribute_id = 1)
        $colorValues = [
            ['attribute_id' => 1, 'value' => 'Đen', 'code' => 'black', 'color_code' => '#000000', 'sort_order' => 1],
            ['attribute_id' => 1, 'value' => 'Trắng', 'code' => 'white', 'color_code' => '#FFFFFF', 'sort_order' => 2],
            ['attribute_id' => 1, 'value' => 'Đỏ', 'code' => 'red', 'color_code' => '#FF0000', 'sort_order' => 3],
            ['attribute_id' => 1, 'value' => 'Xanh dương', 'code' => 'blue', 'color_code' => '#0000FF', 'sort_order' => 4],
            ['attribute_id' => 1, 'value' => 'Xanh lá', 'code' => 'green', 'color_code' => '#00FF00', 'sort_order' => 5],
            ['attribute_id' => 1, 'value' => 'Vàng', 'code' => 'yellow', 'color_code' => '#FFFF00', 'sort_order' => 6],
            ['attribute_id' => 1, 'value' => 'Cam', 'code' => 'orange', 'color_code' => '#FFA500', 'sort_order' => 7],
            ['attribute_id' => 1, 'value' => 'Tím', 'code' => 'purple', 'color_code' => '#800080', 'sort_order' => 8],
            ['attribute_id' => 1, 'value' => 'Hồng', 'code' => 'pink', 'color_code' => '#FFC0CB', 'sort_order' => 9],
            ['attribute_id' => 1, 'value' => 'Nâu', 'code' => 'brown', 'color_code' => '#A52A2A', 'sort_order' => 10],
        ];

        // Kích cỡ (attribute_id = 2)
        $sizeValues = [
            ['attribute_id' => 2, 'value' => 'XS', 'code' => 'xs', 'sort_order' => 1],
            ['attribute_id' => 2, 'value' => 'S', 'code' => 's', 'sort_order' => 2],
            ['attribute_id' => 2, 'value' => 'M', 'code' => 'm', 'sort_order' => 3],
            ['attribute_id' => 2, 'value' => 'L', 'code' => 'l', 'sort_order' => 4],
            ['attribute_id' => 2, 'value' => 'XL', 'code' => 'xl', 'sort_order' => 5],
            ['attribute_id' => 2, 'value' => 'XXL', 'code' => 'xxl', 'sort_order' => 6],
            ['attribute_id' => 2, 'value' => '3XL', 'code' => '3xl', 'sort_order' => 7],
        ];

        // Chất liệu (attribute_id = 3)
        $materialValues = [
            ['attribute_id' => 3, 'value' => 'Cotton', 'code' => 'cotton', 'sort_order' => 1],
            ['attribute_id' => 3, 'value' => 'Polyester', 'code' => 'polyester', 'sort_order' => 2],
            ['attribute_id' => 3, 'value' => 'Vải lanh', 'code' => 'linen', 'sort_order' => 3],
            ['attribute_id' => 3, 'value' => 'Vải len', 'code' => 'wool', 'sort_order' => 4],
            ['attribute_id' => 3, 'value' => 'Vải lụa', 'code' => 'silk', 'sort_order' => 5],
            ['attribute_id' => 3, 'value' => 'Vải denim', 'code' => 'denim', 'sort_order' => 6],
            ['attribute_id' => 3, 'value' => 'Vải kaki', 'code' => 'khaki', 'sort_order' => 7],
        ];

        // Kiểu dáng (attribute_id = 4)
        $styleValues = [
            ['attribute_id' => 4, 'value' => 'Cổ tròn', 'code' => 'round-neck', 'sort_order' => 1],
            ['attribute_id' => 4, 'value' => 'Cổ V', 'code' => 'v-neck', 'sort_order' => 2],
            ['attribute_id' => 4, 'value' => 'Cổ tim', 'code' => 'heart-neck', 'sort_order' => 3],
            ['attribute_id' => 4, 'value' => 'Cổ cao', 'code' => 'turtle-neck', 'sort_order' => 4],
            ['attribute_id' => 4, 'value' => 'Tay ngắn', 'code' => 'short-sleeve', 'sort_order' => 5],
            ['attribute_id' => 4, 'value' => 'Tay dài', 'code' => 'long-sleeve', 'sort_order' => 6],
            ['attribute_id' => 4, 'value' => 'Không tay', 'code' => 'sleeveless', 'sort_order' => 7],
        ];

        $allValues = array_merge($colorValues, $sizeValues, $materialValues, $styleValues);

        foreach ($allValues as $value) {
            DB::table('attribute_values')->insert(array_merge($value, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
