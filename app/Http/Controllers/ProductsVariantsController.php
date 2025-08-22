<?php

namespace App\Http\Controllers;

use App\Models\ProductVariants;
use App\Models\Inventory as InventoryModel;
use Froiden\RestAPI\ApiController;

class ProductsVariantsController extends ApiController
{
    protected $model = ProductVariants::class;

    protected $defaultLimit = 10;

    /**
     * Summary of stored
     * @param \App\Models\ProductVariants $variant
     * @return ProductVariants
     */

    // Tùy biến trước khi store
    protected function stored(ProductVariants $variant): ProductVariants
    {
        if (!$variant->inventory()->exists()) {
            InventoryModel::create([
                'product_variant_id' => $variant->id ?? 0,
                'quantity' => $variant->quantity ?? 0,
                'reserved_quantity' => $variant->reserved_quantity ?? 0,
                'available_quantity' => $variant->available_quantity ?? 0,
                'low_stock_threshold' => $variant->low_stock_threshold ?? 0,
                'is_in_stock' => $variant->is_in_stock ?? true,
                'is_backorder_allowed' => $variant->is_backorder_allowed ?? false,
                'last_restocked_at' => $variant->last_restocked_at ?? null,
            ]);
        }
        return $variant;
    }
}
