<?php

namespace App\Http\Controllers;

use App\Models\AttributesValues;
use Froiden\RestAPI\ApiController;

class AttributesValuesController extends ApiController
{
    protected $model = AttributesValues::class;

    protected $defaultLimit = 10;

    public function __construct()
    {
        parent::__construct();
    }
}
