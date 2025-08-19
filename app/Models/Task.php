<?php

namespace App\Models;

use Froiden\RestAPI\ApiModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends ApiModel
{
    protected $fillable = [
        'id', 'name', 'description', 'status', 'user_id', 'start_date', 'end_date'
    ];

    protected $casts = [
        'id' => 'integer',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    protected $relationKeys = [
        'user_id',
    ];

    protected $default = [
        'id',
        'name',
        'description',
        'status',
        'start_date',
        'end_date',
        'user_id',
        'user{name}'
    ];

    protected $filterable = [
        'id',
        'name',
        'description',
        'status',
        'start_date',
        'end_date',
        'user_id',
        'user'
    ];

    protected $primaryKey = 'id';
    /**
     * Quan hệ với bảng users
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
