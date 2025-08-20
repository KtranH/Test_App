<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Froiden\RestAPI\ApiController;

class ProductsController extends ApiController
{
    protected $model = Products::class;

    protected $defaultLimit = 10;

}
