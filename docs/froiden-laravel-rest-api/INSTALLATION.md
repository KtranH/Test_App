# Cài đặt và Cấu hình

## 📋 Yêu cầu hệ thống

- **PHP**: 8.0 hoặc cao hơn
- **Laravel**: 8.0 hoặc cao hơn
- **Composer**: 2.0 hoặc cao hơn

## 🚀 Cài đặt

### 1. Cài đặt qua Composer

```bash
composer require froiden/laravel-rest-api
```

### 2. Publish Configuration Files

```bash
php artisan vendor:publish --provider="Froiden\RestAPI\Providers\ApiServiceProvider"
```

Lệnh này sẽ tạo file `config/api.php` trong project của bạn.

### 3. Kiểm tra cài đặt

Sau khi cài đặt, bạn có thể kiểm tra bằng cách:

```bash
php artisan route:list
```

Bạn sẽ thấy các route mới được đăng ký bởi thư viện.

## ⚙️ Cấu hình

### File cấu hình `config/api.php`

```php
<?php

return [
    /**
     * Số lượng bản ghi mặc định trả về khi không có limit
     */
    'defaultLimit' => 10,

    /**
     * Số lượng bản ghi tối đa trong một request
     */
    'maxLimit' => 1000,

    /**
     * Bật/tắt CORS headers
     */
    'cors' => true,

    /**
     * Headers được phép trong CORS requests
     */
    'cors_headers' => ['Authorization', 'Content-Type'],

    /**
     * Các field không được xem xét khi lưu model
     */
    'excludes' => ['_token'],

    /**
     * Prefix cho tất cả API routes
     */
    'prefix' => 'api',

    /**
     * Version mặc định cho API (null để tắt)
     */
    'default_version' => 'v1',

    /**
     * Case cho relation method names (snakecase|camelcase)
     */
    'relation_case' => 'snakecase'
];
```

### Tùy chỉnh cấu hình

#### 1. Thay đổi prefix API

```php
// config/api.php
'prefix' => 'v1/api',
```

#### 2. Tắt CORS

```php
// config/api.php
'cors' => false,
```

#### 3. Thay đổi limit mặc định

```php
// config/api.php
'defaultLimit' => 25,
'maxLimit' => 500,
```

## 🔧 Tích hợp với Laravel

### 1. Service Provider

Thư viện tự động đăng ký `ApiServiceProvider` trong `config/app.php`:

```php
'providers' => [
    // ...
    Froiden\RestAPI\Providers\ApiServiceProvider::class,
],
```

### 2. Exception Handler

Thư viện tự động đăng ký `ApiExceptionHandler` để xử lý các exception của API.

### 3. Middleware

Thư viện tự động thêm `ApiMiddleware` vào tất cả các route được tạo qua `ApiRoute`.

## 📁 Cấu trúc thư mục sau khi cài đặt

```
your-project/
├── config/
│   └── api.php                    # Cấu hình API
├── app/
│   └── Http/
│       └── Controllers/
│           └── YourApiController.php
├── routes/
│   └── api.php                    # API routes
└── vendor/
    └── froiden/
        └── laravel-rest-api/      # Thư viện
```

## 🧪 Kiểm tra cài đặt

### 1. Tạo Controller test

```php
<?php

namespace App\Http\Controllers;

use Froiden\RestAPI\ApiController;
use App\Models\User;

class TestController extends ApiController
{
    protected $model = User::class;
}
```

### 2. Tạo Route test

```php
// routes/api.php
use Froiden\RestAPI\Facades\ApiRoute;

ApiRoute::get('test', [TestController::class, 'index']);
```

### 3. Test API

```bash
curl http://your-app.test/api/test
```

Nếu nhận được response JSON, thư viện đã hoạt động thành công!

## 🚨 Troubleshooting

### Lỗi thường gặp

#### 1. Class not found
```bash
composer dump-autoload
```

#### 2. Route không hoạt động
```bash
php artisan route:clear
php artisan config:clear
```

#### 3. CORS errors
Kiểm tra cấu hình `config/api.php` và đảm bảo `cors` được bật.

#### 4. Middleware không hoạt động
Đảm bảo `ApiServiceProvider` đã được đăng ký trong `config/app.php`.

### Debug Mode

Bật debug mode để xem thông tin chi tiết:

```php
// config/app.php
'debug' => true,
```

Khi debug được bật, thư viện sẽ:
- Log tất cả SQL queries
- Hiển thị thông tin processing time
- Cung cấp thông tin chi tiết về request parsing

## 🔄 Cập nhật

### Cập nhật thư viện

```bash
composer update froiden/laravel-rest-api
```

### Cập nhật cấu hình

```bash
php artisan vendor:publish --provider="Froiden\RestAPI\Providers\ApiServiceProvider" --force
```

## 📚 Bước tiếp theo

Sau khi cài đặt thành công, bạn có thể:

1. [Đọc về Khái niệm cốt lõi](CORE_CONCEPTS.md)
2. [Tạo ApiController đầu tiên](API_CONTROLLER.md)
3. [Cấu hình ApiModel](API_MODEL.md)
4. [Thiết lập Routing](ROUTING.md)

---

🎉 **Chúc mừng!** Bạn đã cài đặt thành công Froiden Laravel REST API. Bây giờ hãy bắt đầu xây dựng API chuyên nghiệp của mình!
