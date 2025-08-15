<?php

use Illuminate\Support\Facades\Route;
use Froiden\RestAPI\Facades\ApiRoute;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

// Bắt tất cả các route không phải api để Vue router có thể xử lý
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');