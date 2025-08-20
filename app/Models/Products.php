<?php

namespace App\Models;

use Froiden\RestAPI\ApiModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Products extends ApiModel
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'category_id',
        'brand',
        'sku',
        'base_price',
        'sale_price',
        'sale_start_date',
        'sale_end_date',
        'is_featured',
        'is_active',
        'sort_order',
        'meta_data',
    ];

    protected $casts = [
        'id' => 'integer',
        'category_id' => 'integer',
        'base_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'sale_start_date' => 'date',
        'sale_end_date' => 'date',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'meta_data' => 'array',
    ];

    protected $filterable = [
        'id',
        'name',
        'slug',
        'description',
        'short_description',
        'category_id',
        'brand',
        'sku',
        'base_price',
        'sale_price',
        'sale_start_date',
        'sale_end_date',
        'is_featured',
        'is_active',
        'sort_order',
        'meta_data',
    ];

    protected $default = [
        'id',
        'name',
        'slug',
        'description',
        'short_description',
        'category_id',
        'brand',
        'sku',
        'base_price',
        'sale_price',
        'sale_start_date',
        'sale_end_date',
        'is_featured',
        'is_active',
        'sort_order',
        'meta_data',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariants::class, 'product_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImages::class, 'product_id');
    }
}
