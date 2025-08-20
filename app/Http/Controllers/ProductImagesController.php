<?php

namespace App\Http\Controllers;

use App\Models\ProductImages;
use Froiden\RestAPI\ApiController;

class ProductImagesController extends ApiController
{
    protected $model = ProductImages::class;

    protected $defaultLimit = 10;

}
