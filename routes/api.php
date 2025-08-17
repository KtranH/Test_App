<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Froiden\RestAPI\Facades\ApiRoute;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public authentication routes
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Email verification routes
Route::post('/send-verification-code', [AuthController::class, 'sendVerificationCode']);
Route::post('/verify-email-with-registration', [AuthController::class, 'verifyEmailWithRegistration']);

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working correctly',
        'timestamp' => now()->toISOString(),
        'security' => 'Enhanced security enabled'
    ]);
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0',
        'environment' => config('app.env')
    ]);
});

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    //Route::put('/profile', [AuthController::class, 'updateProfile']);
    //Route::post('/change-password', [AuthController::class, 'changePassword']);
});

ApiRoute::group([
    'middleware' => 'api',
    'namespace' => 'App\Http\Controllers',
], function () {
    ApiRoute::middleware('auth:sanctum')->group(function () {
        ApiRoute::resource('users', UserController::class);
    });
});
