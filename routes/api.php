<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TwoFactorController;
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

    // Two-Factor routes (enable/disable)
    Route::get('/2fa/status', [TwoFactorController::class, 'status']);
    Route::post('/2fa/init-enable', [TwoFactorController::class, 'initEnable']);
    Route::post('/2fa/confirm-enable', [TwoFactorController::class, 'confirmEnable']);
    Route::post('/2fa/disable', [TwoFactorController::class, 'disable']);
});

// User management routes với phân quyền
ApiRoute::group([
    'middleware' => 'api',
    'namespace' => 'App\Http\Controllers',
], function () {
    ApiRoute::middleware(['auth:sanctum'])->group(function () {
        // Tất cả user đã đăng nhập có thể xem danh sách (policy sẽ handle chi tiết)
        ApiRoute::get('users', [UserController::class, 'index']);
        ApiRoute::get('users/{id}', [UserController::class, 'show']);
        
        // Chỉ admin và super_admin mới có thể tạo user mới
        ApiRoute::middleware(['role:admin,super_admin'])->group(function () {
            ApiRoute::post('users', [UserController::class, 'store']);
        });
        
        // Update và delete sẽ được policy handle chi tiết
        ApiRoute::put('users/{id}', [UserController::class, 'update']);
        ApiRoute::patch('users/{id}', [UserController::class, 'update']);
        ApiRoute::delete('users/{id}', [UserController::class, 'destroy']);
    });
});

// Route cũ để tương thích ngược
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/users/paginate', [UserController::class, 'paginate']);
});

// 2FA verify after login challenge (no auth token yet)
Route::post('/2fa/verify-login', [TwoFactorController::class, 'verifyLogin']);
