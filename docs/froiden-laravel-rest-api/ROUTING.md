# Routing System - Hướng dẫn chi tiết

## 🎯 Tổng quan

Hệ thống routing của Froiden Laravel REST API được xây dựng trên nền tảng Laravel Router với các tính năng bổ sung như automatic middleware, versioning, prefixing, và API-specific optimizations. Thư viện sử dụng `ApiRoute` facade để đăng ký routes một cách dễ dàng và nhất quán.

## 🚀 ApiRoute Facade

### Cú pháp cơ bản

```php
use Froiden\RestAPI\Facades\ApiRoute;

// Route đơn giản
ApiRoute::get('users', [UserController::class, 'index']);
ApiRoute::post('users', [UserController::class, 'store']);
ApiRoute::get('users/{id}', [UserController::class, 'show']);
ApiRoute::put('users/{id}', [UserController::class, 'update']);
ApiRoute::delete('users/{id}', [UserController::class, 'destroy']);

// Resource route (tự động tạo tất cả CRUD routes)
ApiRoute::resource('users', UserController::class);
```

### HTTP Methods hỗ trợ

```php
ApiRoute::get($uri, $action);      // GET request
ApiRoute::post($uri, $action);     // POST request
ApiRoute::put($uri, $action);      // PUT request
ApiRoute::patch($uri, $action);    // PATCH request
ApiRoute::delete($uri, $action);   // DELETE request
ApiRoute::options($uri, $action);  // OPTIONS request
```

## 🔧 Route Configuration

### 1. Basic Route Registration

```php
// routes/api.php
use Froiden\RestAPI\Facades\ApiRoute;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;

// User routes
ApiRoute::get('users', [UserController::class, 'index']);
ApiRoute::get('users/{id}', [UserController::class, 'show']);
ApiRoute::post('users', [UserController::class, 'store']);
ApiRoute::put('users/{id}', [UserController::class, 'update']);
ApiRoute::delete('users/{id}', [UserController::class, 'destroy']);

// Post routes
ApiRoute::get('posts', [PostController::class, 'index']);
ApiRoute::get('posts/{id}', [PostController::class, 'show']);
ApiRoute::post('posts', [PostController::class, 'store']);
ApiRoute::put('posts/{id}', [PostController::class, 'update']);
ApiRoute::delete('posts/{id}', [PostController::class, 'destroy']);
```

### 2. Resource Routes

```php
// Tự động tạo tất cả CRUD routes
ApiRoute::resource('users', UserController::class);

// Tùy chỉnh resource routes
ApiRoute::resource('users', UserController::class, [
    'only' => ['index', 'show', 'store'],  // Chỉ tạo routes này
    'except' => ['destroy'],               // Không tạo route này
    'names' => [                           // Tùy chỉnh route names
        'index' => 'users.list',
        'show' => 'users.view',
        'store' => 'users.create'
    ]
]);
```

### 3. Route Grouping

```php
// Group routes với middleware chung
ApiRoute::middleware(['auth:sanctum'])->group(function () {
    ApiRoute::get('users', [UserController::class, 'index']);
    ApiRoute::get('users/{id}', [UserController::class, 'show']);
    ApiRoute::post('users', [UserController::class, 'store']);
    ApiRoute::put('users/{id}', [UserController::class, 'update']);
    ApiRoute::delete('users/{id}', [UserController::class, 'destroy']);
});

// Nested grouping
ApiRoute::middleware(['auth:sanctum'])->group(function () {
    ApiRoute::prefix('admin')->middleware(['role:admin'])->group(function () {
        ApiRoute::get('users', [AdminUserController::class, 'index']);
        ApiRoute::get('users/{id}', [AdminUserController::class, 'show']);
    });
    
    ApiRoute::prefix('user')->middleware(['role:user'])->group(function () {
        ApiRoute::get('profile', [UserProfileController::class, 'show']);
        ApiRoute::put('profile', [UserProfileController::class, 'update']);
    });
});
```

## 🛡️ Middleware Integration

### 1. Automatic Middleware

```php
// Tất cả ApiRoute tự động có ApiMiddleware
ApiRoute::get('users', [UserController::class, 'index']);
// Tự động thêm: ApiMiddleware, CORS headers, error handling
```

### 2. Custom Middleware

```php
// Thêm middleware tùy chỉnh
ApiRoute::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    ApiRoute::get('users', [UserController::class, 'index']);
    ApiRoute::post('users', [UserController::class, 'store']);
});

// Middleware cho specific routes
ApiRoute::get('users', [UserController::class, 'index'])
    ->middleware(['auth:sanctum', 'can:view-users']);

ApiRoute::post('users', [UserController::class, 'store'])
    ->middleware(['auth:sanctum', 'can:create-users']);
```

### 3. Middleware Stack

```php
// Middleware stack cho admin routes
ApiRoute::middleware([
    'auth:sanctum',
    'role:admin',
    'throttle:100,1',
    'log:admin-actions'
])->prefix('admin')->group(function () {
    ApiRoute::resource('users', AdminUserController::class);
    ApiRoute::resource('roles', RoleController::class);
    ApiRoute::resource('permissions', PermissionController::class);
});
```

## 🌐 API Versioning

### 1. Version Prefix

```php
// Version routes
ApiRoute::version('v1')->group(function () {
    ApiRoute::get('users', [UserController::class, 'index']);
    ApiRoute::get('users/{id}', [UserController::class, 'show']);
});

ApiRoute::version('v2')->group(function () {
    ApiRoute::get('users', [UserV2Controller::class, 'index']);
    ApiRoute::get('users/{id}', [UserV2Controller::class, 'show']);
});

// Multiple versions
ApiRoute::version(['v1', 'v2'])->group(function () {
    ApiRoute::get('users', [UserController::class, 'index']);
    ApiRoute::get('users/{id}', [UserController::class, 'show']);
});
```

### 2. Default Version

```php
// config/api.php
'default_version' => 'v1',

// Routes không có version sẽ sử dụng default
ApiRoute::get('users', [UserController::class, 'index']);
// Tự động thêm prefix 'v1'
```

### 3. Version-specific Controllers

```php
// app/Http/Controllers/Api/V1/UserController.php
namespace App\Http\Controllers\Api\V1;

use Froiden\RestAPI\ApiController;

class UserController extends ApiController
{
    protected $model = \App\Models\User::class;
}

// app/Http/Controllers/Api/V2/UserController.php
namespace App\Http\Controllers\Api\V2;

use Froiden\RestAPI\ApiController;

class UserController extends ApiController
{
    protected $model = \App\Models\User::class;
    
    // V2 features
    protected function modifyIndex($query)
    {
        return $query->with(['profile', 'roles', 'permissions']);
    }
}
```

## 🔗 Route Parameters

### 1. Basic Parameters

```php
// Single parameter
ApiRoute::get('users/{id}', [UserController::class, 'show']);

// Multiple parameters
ApiRoute::get('users/{user}/posts/{post}', [UserPostController::class, 'show']);

// Optional parameters
ApiRoute::get('users/{id?}', [UserController::class, 'show']);
```

### 2. Parameter Constraints

```php
// Parameter constraints
ApiRoute::get('users/{id}', [UserController::class, 'show'])
    ->where('id', '[0-9]+');

ApiRoute::get('users/{username}', [UserController::class, 'showByUsername'])
    ->where('username', '[a-zA-Z0-9_-]+');

// Multiple constraints
ApiRoute::get('posts/{year}/{month}', [PostController::class, 'byMonth'])
    ->where(['year' => '[0-9]{4}', 'month' => '[0-9]{1,2}']);
```

### 3. Route Model Binding

```php
// Automatic route model binding
ApiRoute::get('users/{user}', [UserController::class, 'show']);

// Custom route model binding
ApiRoute::get('users/{user:email}', [UserController::class, 'showByEmail']);
ApiRoute::get('users/{user:username}', [UserController::class, 'showByUsername']);
```

## 📊 Advanced Routing Patterns

### 1. Nested Resources

```php
// Nested resources
ApiRoute::get('users/{user}/posts', [UserPostController::class, 'index']);
ApiRoute::get('users/{user}/posts/{post}', [UserPostController::class, 'show']);
ApiRoute::post('users/{user}/posts', [UserPostController::class, 'store']);
ApiRoute::put('users/{user}/posts/{post}', [UserPostController::class, 'update']);
ApiRoute::delete('users/{user}/posts/{post}', [UserPostController::class, 'destroy']);

// Hoặc sử dụng resource
ApiRoute::resource('users.posts', UserPostController::class);
```

### 2. Custom Route Names

```php
// Custom route names
ApiRoute::get('users', [UserController::class, 'index'])
    ->name('users.list');

ApiRoute::get('users/{id}', [UserController::class, 'show'])
    ->name('users.view');

ApiRoute::post('users', [UserController::class, 'store'])
    ->name('users.create');

// Resource với custom names
ApiRoute::resource('users', UserController::class, [
    'names' => [
        'index' => 'users.list',
        'show' => 'users.view',
        'store' => 'users.create',
        'update' => 'users.edit',
        'destroy' => 'users.delete'
    ]
]);
```

### 3. Route Prefixing

```php
// Global prefix
// config/api.php: 'prefix' => 'api'

// Route-specific prefix
ApiRoute::prefix('admin')->group(function () {
    ApiRoute::get('users', [AdminUserController::class, 'index']);
    ApiRoute::get('users/{id}', [AdminUserController::class, 'show']);
});

// Nested prefixing
ApiRoute::prefix('api/v1/admin')->group(function () {
    ApiRoute::get('users', [AdminUserController::class, 'index']);
    ApiRoute::get('users/{id}', [AdminUserController::class, 'show']);
});
```

## 🔍 Route Discovery và Testing

### 1. List Routes

```bash
# Liệt kê tất cả routes
php artisan route:list

# Liệt kê routes theo pattern
php artisan route:list --name=users.*

# Liệt kê routes theo method
php artisan route:list --method=GET
```

### 2. Route Caching

```bash
# Cache routes để tăng performance
php artisan route:cache

# Clear route cache
php artisan route:clear

# Clear tất cả cache
php artisan optimize:clear
```

### 3. Route Testing

```php
// tests/Feature/UserApiTest.php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class UserApiTest extends TestCase
{
    public function test_can_list_users()
    {
        $response = $this->getJson('/api/users');
        
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => ['id', 'name', 'email']
                    ],
                    'meta' => ['total', 'limit', 'offset']
                ]);
    }
    
    public function test_can_show_user()
    {
        $user = User::factory()->create();
        
        $response = $this->getJson("/api/users/{$user->id}");
        
        $response->assertStatus(200)
                ->assertJson([
                    'data' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ]);
    }
}
```

## 🚨 Common Issues và Solutions

### 1. Route Not Found

```php
// ❌ Sai: Route không được đăng ký
Route::get('users', [UserController::class, 'index']);

// ✅ Đúng: Sử dụng ApiRoute
ApiRoute::get('users', [UserController::class, 'index']);
```

### 2. Middleware Not Applied

```php
// ❌ Sai: Middleware không được áp dụng
ApiRoute::get('users', [UserController::class, 'index']);

// ✅ Đúng: Thêm middleware
ApiRoute::middleware(['auth:sanctum'])->group(function () {
    ApiRoute::get('users', [UserController::class, 'index']);
});
```

### 3. Version Not Working

```php
// ❌ Sai: Version không được áp dụng
ApiRoute::get('users', [UserController::class, 'index']);

// ✅ Đúng: Sử dụng version group
ApiRoute::version('v1')->group(function () {
    ApiRoute::get('users', [UserController::class, 'index']);
});
```

## 📚 Best Practices

### 1. Route Organization
- **Logical Grouping**: Nhóm routes theo chức năng
- **Middleware Stack**: Sử dụng middleware groups cho common patterns
- **Versioning**: Sử dụng versioning cho backward compatibility

### 2. Security
- **Authentication**: Luôn áp dụng auth middleware cho protected routes
- **Authorization**: Sử dụng role/permission middleware
- **Rate Limiting**: Áp dụng throttle middleware cho public APIs

### 3. Performance
- **Route Caching**: Cache routes trong production
- **Middleware Optimization**: Chỉ áp dụng middleware cần thiết
- **Resource Routes**: Sử dụng resource routes khi có thể

### 4. Maintainability
- **Consistent Naming**: Sử dụng naming convention nhất quán
- **Documentation**: Comment routes phức tạp
- **Testing**: Viết tests cho tất cả routes

---

🎯 **Tóm tắt**: Hệ thống routing của Froiden Laravel REST API cung cấp một cách mạnh mẽ và linh hoạt để đăng ký API routes với automatic middleware, versioning, và các tính năng bảo mật tích hợp. Sử dụng `ApiRoute` facade để tạo ra API endpoints một cách nhất quán và dễ bảo trì.
