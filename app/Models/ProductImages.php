<?php

namespace App\Models;

use Froiden\RestAPI\ApiModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductImages extends ApiModel
{
    use SoftDeletes;

    protected $fillable = [
        'product_id',
        'product_variant_id',
        'image_path',
        'alt_text',
        'title',
        'sort_order',
        'is_primary',
        'is_active',
    ];

    protected $casts = [
        'id' => 'integer',
        'product_id' => 'integer',
        'product_variant_id' => 'integer',
        'sort_order' => 'integer',
        'is_primary' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $filterable = [
        'id',
        'product_id',
        'product_variant_id',
        'image_path',
        'alt_text',
        'title',
        'sort_order',
        'is_primary',
        'is_active',
    ];

    protected $default = [
        'id',
        'product_id',
        'product_variant_id',
        'image_path',
        'alt_text',
        'title',
        'sort_order',
        'is_primary',
        'is_active',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariants::class, 'product_variant_id');
    }
}
