<?php

use Illuminate\Support\Facades\Route;
use Froiden\RestAPI\Facades\ApiRoute;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return view('welcome');
});

ApiRoute::group([
    'middleware' => 'api',
    'namespace' => 'App\Http\Controllers',
], function () {
    ApiRoute::resource('users', UserController::class);
    
    // Endpoint chính cho phân trang: GET /api/v1/users?limit=10&offset=0
    // Không cần users-paginated nữa vì đã có trong resource
});

// Bắt tất cả các route không phải api
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');