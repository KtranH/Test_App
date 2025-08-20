<?php

namespace App\Http\Controllers;

use App\Models\Attributes;
use Froiden\RestAPI\ApiController;
class AttributesController extends ApiController
{
    protected $model = Attributes::class;

    protected $defaultLimit = 10;

}
