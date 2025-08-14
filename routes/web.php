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

    // Thêm routes cho phân trang
    ApiRoute::get('users-paginated', [UserController::class, 'paginate']);
    ApiRoute::get('users-all', [UserController::class, 'all']);
    ApiRoute::get('users-full', [UserController::class, 'allWithFroiden']);
});

// Bắt tất cả các route không phải api
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');