<?php

namespace App\Models;

use Froiden\RestAPI\ApiModel;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attributes extends ApiModel
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'type',
        'is_required',
        'is_filterable',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'id' => 'integer',
        'is_required' => 'boolean',
        'is_filterable' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $filterable = [
        'id',
        'name',
        'code',
        'description',
        'type',
        'is_required',
        'is_filterable',
        'is_active',
        'sort_order',
    ];

    protected $default = [
        'id',
        'name',
        'code',
        'description',
        'type',
        'is_required',
        'is_filterable',
        'is_active',
        'sort_order',
        'created_at',
        'updated_at',
        'values{value,code}'
    ];

    protected $primaryKey = 'id';
    
    public function values(): HasMany
    {
        return $this->hasMany(AttributesValues::class, 'attribute_id', 'id');
    }

    public function variants(): BelongsToMany
    {
        return $this->belongsToMany(ProductVariants::class, 'product_variant_attributes', 'attribute_id', 'product_variant_id')
            ->withPivot('attribute_value_id')
            ->withTimestamps();
    }
}
