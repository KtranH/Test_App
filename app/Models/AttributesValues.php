<?php

namespace App\Models;

use Froiden\RestAPI\ApiModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttributesValues extends ApiModel
{
    use SoftDeletes;

    protected $table = 'attribute_values';

    protected $fillable = [
        'attribute_id',
        'value',
        'code',
        'color_code',
        'image',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'id' => 'integer',
        'attribute_id' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $filterable = [
        'id',
        'attribute_id',
        'value',
        'code',
        'color_code',
        'image',
        'sort_order',
        'is_active',
        'created_at',
        'updated_at',
    ];

    protected $default = [
        'id',
        'value',
        'code',
        'color_code',
        'image',
        'sort_order',
        'is_active',
        'created_at',
        'updated_at',
    ];

    protected $primaryKey = 'id';

    protected $with = ['attribute'];

    public function attribute(): BelongsTo
    {
        return $this->belongsTo(Attributes::class, 'attribute_id');
    }

    public function variants(): BelongsToMany
    {
        return $this->belongsToMany(ProductVariants::class, 'product_variant_attributes', 'attribute_value_id', 'product_variant_id')
            ->withPivot('attribute_id')
            ->withTimestamps();
    }
}
