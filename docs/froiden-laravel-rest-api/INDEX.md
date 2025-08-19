# Froiden Laravel REST API - Tài liệu tổng hợp

## 📚 Danh sách tài liệu đầy đủ

### 🚀 Tài liệu cơ bản
- **[README.md](README.md)** - Tổng quan thư viện và hướng dẫn nhanh
- **[INSTALLATION.md](INSTALLATION.md)** - Cài đặt và cấu hình chi tiết
- **[CORE_CONCEPTS.md](CORE_CONCEPTS.md)** - Khái niệm cốt lõi và kiến trúc

### 🎮 Hướng dẫn sử dụng
- **[API_CONTROLLER.md](API_CONTROLLER.md)** - Hướng dẫn chi tiết về ApiController
- **[API_MODEL.md](API_MODEL.md)** - Hướng dẫn về ApiModel và field management
- **[ROUTING.md](ROUTING.md)** - Hệ thống routing và ApiRoute facade
- **[REQUEST_PARSING.md](REQUEST_PARSING.md)** - Xử lý query parameters và RequestParser

### 🔧 Tài liệu nâng cao
- **[HOOKS_AND_CUSTOMIZATION.md](HOOKS_AND_CUSTOMIZATION.md)** - Lifecycle hooks và tùy biến
- **[EXCEPTION_HANDLING.md](EXCEPTION_HANDLING.md)** - Xử lý lỗi và exceptions
- **[ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)** - Tính năng nâng cao và optimization
- **[BEST_PRACTICES.md](BEST_PRACTICES.md)** - Best practices và design patterns
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Hướng dẫn migration từ code cũ

## 🎯 Lộ trình học tập

### 📖 Bước 1: Cơ bản (1-2 ngày)
1. Đọc [README.md](README.md) để hiểu tổng quan
2. Làm theo [INSTALLATION.md](INSTALLATION.md) để cài đặt
3. Đọc [CORE_CONCEPTS.md](CORE_CONCEPTS.md) để hiểu kiến trúc

### 🚀 Bước 2: Thực hành (3-5 ngày)
1. Tạo ApiController đầu tiên theo [API_CONTROLLER.md](API_CONTROLLER.md)
2. Cấu hình ApiModel theo [API_MODEL.md](API_MODEL.md)
3. Thiết lập routing theo [ROUTING.md](ROUTING.md)
4. Test các query parameters theo [REQUEST_PARSING.md](REQUEST_PARSING.md)

### 🔧 Bước 3: Nâng cao (1-2 tuần)
1. Sử dụng lifecycle hooks theo [HOOKS_AND_CUSTOMIZATION.md](HOOKS_AND_CUSTOMIZATION.md)
2. Implement exception handling theo [EXCEPTION_HANDLING.md](EXCEPTION_HANDLING.md)
3. Áp dụng advanced features theo [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)
4. Follow best practices theo [BEST_PRACTICES.md](BEST_PRACTICES.md)

### 🔄 Bước 4: Migration (nếu cần)
1. Đọc [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) để hiểu quy trình
2. Plan migration strategy
3. Execute migration step by step

## 🌟 Tính năng chính của thư viện

### 🚀 Auto CRUD Operations
- Tự động tạo các endpoint CRUD cơ bản
- Lifecycle hooks cho mọi operation
- Transaction management tự động

### 🔍 Advanced Query Parsing
- Fields selection với nested relations
- Complex filtering với logical operators
- Sorting và pagination
- Eager loading tự động

### 🛡️ Built-in Security
- Field visibility control
- Filterable fields whitelist
- CORS handling
- Input validation

### 📊 Rich Response Format
- Structured JSON responses
- Metadata và pagination links
- Error handling chuyên nghiệp
- Performance metrics

## 🔧 Các thành phần chính

| Thành phần | Mô tả | Tài liệu |
|------------|-------|----------|
| **ApiController** | Base controller với CRUD tự động | [API_CONTROLLER.md](API_CONTROLLER.md) |
| **ApiModel** | Base model với field management | [API_MODEL.md](API_MODEL.md) |
| **ApiRoute** | Facade để đăng ký API routes | [ROUTING.md](ROUTING.md) |
| **RequestParser** | Xử lý query parameters | [REQUEST_PARSING.md](REQUEST_PARSING.md) |
| **ApiResponse** | Format response theo chuẩn API | [CORE_CONCEPTS.md](CORE_CONCEPTS.md) |

## 📋 Yêu cầu hệ thống

- **PHP**: 8.0+
- **Laravel**: 8.0+
- **Composer**: 2.0+
- **Database**: MySQL 5.7+, PostgreSQL 10+, SQLite 3.8+

## 🚀 Quick Start

### 1. Cài đặt
```bash
composer require froiden/laravel-rest-api
php artisan vendor:publish --provider="Froiden\RestAPI\Providers\ApiServiceProvider"
```

### 2. Tạo Controller
```php
<?php

namespace App\Http\Controllers;

use Froiden\RestAPI\ApiController;
use App\Models\User;

class UserController extends ApiController
{
    protected $model = User::class;
}
```

### 3. Định nghĩa Routes
```php
use Froiden\RestAPI\Facades\ApiRoute;

ApiRoute::middleware(['auth:sanctum'])->group(function () {
    ApiRoute::resource('users', UserController::class);
});
```

### 4. Test API
```bash
curl http://your-app.test/api/users
```

## 🔍 Ví dụ thực tế

### API Endpoints
```
GET    /api/users              - Lấy danh sách users
GET    /api/users/{id}         - Lấy chi tiết user
POST   /api/users              - Tạo user mới
PUT    /api/users/{id}         - Cập nhật user
DELETE /api/users/{id}         - Xóa user
```

### Query Parameters
```
GET /api/users?fields=id,name,email&filters=(is_active eq true)&order=name asc&limit=20&offset=0
```

### Response Format
```json
{
    "data": [...],
    "meta": {
        "total": 100,
        "limit": 20,
        "offset": 0,
        "queries": 3,
        "processing_time": 0.045
    }
}
```

## 🚨 Troubleshooting

### Lỗi thường gặp
1. **Class not found**: `composer dump-autoload`
2. **Route không hoạt động**: `php artisan route:clear`
3. **CORS errors**: Kiểm tra config `config/api.php`
4. **Middleware không hoạt động**: Đảm bảo sử dụng `ApiRoute`

### Debug Mode
```php
// config/app.php
'debug' => true,
```

## 🤝 Hỗ trợ và Đóng góp

- **Documentation**: Đọc kỹ tài liệu trước khi hỏi
- **Issues**: Tạo issue với thông tin chi tiết
- **Pull Requests**: Đóng góp code improvements
- **Community**: Tham gia discussions

## 📚 Tài liệu tham khảo

- [Laravel Documentation](https://laravel.com/docs)
- [REST API Best Practices](https://restfulapi.net/)
- [JSON API Specification](https://jsonapi.org/)
- [OpenAPI Specification](https://swagger.io/specification/)

## 🔄 Cập nhật

### Cập nhật thư viện
```bash
composer update froiden/laravel-rest-api
```

### Cập nhật cấu hình
```bash
php artisan vendor:publish --provider="Froiden\RestAPI\Providers\ApiServiceProvider" --force
```

---

🎉 **Chúc mừng!** Bạn đã có đầy đủ tài liệu để làm chủ Froiden Laravel REST API. Hãy bắt đầu với tài liệu cơ bản và dần dần tiến tới các tính năng nâng cao!

**Froiden Laravel REST API** - Xây dựng RESTful API chuyên nghiệp một cách nhanh chóng và hiệu quả! 🚀
