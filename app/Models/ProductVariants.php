<?php

namespace App\Models;

use Froiden\RestAPI\ApiModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariants extends ApiModel
{
    use SoftDeletes;

    protected $fillable = [
        'product_id',
        'sku',
        'name',
        'price',
        'sale_price',
        'weight',
        'width',
        'height',
        'length',
        'is_active',
        'attribute_combination',
    ];

    protected $casts = [
        'id' => 'integer',
        'product_id' => 'integer',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'weight' => 'integer',
        'width' => 'decimal:2',
        'height' => 'decimal:2',
        'length' => 'decimal:2',
        'is_active' => 'boolean',
        'attribute_combination' => 'array',
    ];

    protected $filterable = [
        'id',
        'product_id',
        'sku',
        'name',
        'price',
        'sale_price',
        'weight',
        'width',
        'height',
        'length',
        'is_active',
        'attribute_combination',
    ];

    protected $default = [
        'id',
        'sku',
        'name',
        'price',
        'sale_price',
        'weight',
        'width',
        'height',
        'length',
        'is_active',
        'attribute_combination',
    ];

    protected $primaryKey = 'id';

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImages::class, 'product_variant_id');
    }

    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class, 'product_variant_id');
    }

    public function attributes(): BelongsToMany
    {
        return $this->belongsToMany(Attributes::class, 'product_variant_attributes', 'product_variant_id', 'attribute_id')
            ->withPivot('attribute_value_id')
            ->withTimestamps();
    }

    public function attributeValues(): BelongsToMany
    {
        return $this->belongsToMany(AttributesValues::class, 'product_variant_attributes', 'product_variant_id', 'attribute_value_id')
            ->withPivot('attribute_id')
            ->withTimestamps();
    }
}
