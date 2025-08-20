<?php

namespace App\Http\Controllers;

use App\Models\ProductVariants;
use Froiden\RestAPI\ApiController;

class ProductsVariantsController extends ApiController
{
    protected $model = ProductVariants::class;

    protected $defaultLimit = 10;

}
