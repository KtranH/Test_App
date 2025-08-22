<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Froiden\RestAPI\ApiController;
use Illuminate\Support\Facades\Log;

class InventoryController extends ApiController
{
    protected $model = Inventory::class;

    protected $defaultLimit = 10;
}
