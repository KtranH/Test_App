<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Froiden\RestAPI\ApiController;

class CategoriesController extends ApiController
{
    protected $model = Categories::class;

    protected $defaultLimit = 10;

}
