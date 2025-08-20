<?php

namespace App\Models;

use Froiden\RestAPI\ApiModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventory extends ApiModel
{
    use SoftDeletes;

    protected $table = 'inventory';

    protected $fillable = [
        'product_variant_id',
        'quantity',
        'reserved_quantity',
        'available_quantity',
        'low_stock_threshold',
        'is_in_stock',
        'is_backorder_allowed',
        'last_restocked_at',
    ];

    protected $casts = [
        'id' => 'integer',
        'product_variant_id' => 'integer',
        'quantity' => 'integer',
        'reserved_quantity' => 'integer',
        'available_quantity' => 'integer',
        'low_stock_threshold' => 'integer',
        'is_in_stock' => 'boolean',
        'is_backorder_allowed' => 'boolean',
        'last_restocked_at' => 'datetime',
    ];

    protected $filterable = [
        'id',
        'product_variant_id',
        'quantity',
        'reserved_quantity',
        'available_quantity',
        'low_stock_threshold',
        'is_in_stock',
        'is_backorder_allowed',
        'last_restocked_at',
    ];

    protected $default = [
        'id',
        'product_variant_id',
        'quantity',
        'reserved_quantity',
        'available_quantity',
        'low_stock_threshold',
        'is_in_stock',
        'is_backorder_allowed',
        'last_restocked_at',
    ];

    protected $primaryKey = 'id';

    protected $with = ['variant'];

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariants::class, 'product_variant_id');
    }
}
