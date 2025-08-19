# Froiden Laravel REST API

## Tổng quan

**Froiden Laravel REST API** là một thư viện mạnh mẽ giúp xây dựng RESTful API một cách nhanh chóng và chuyên nghiệp trong Laravel. Thư viện cung cấp các tính năng tự động hóa cho CRUD operations, request parsing, response formatting, và nhiều tính năng nâng cao khác.

## ✨ Tính năng chính

- 🚀 **Auto CRUD Operations** - Tự động tạo các endpoint CRUD cơ bản
- 🔍 **Advanced Query Parsing** - Hỗ trợ filtering, sorting, pagination, và relations
- 🎯 **Smart Request Validation** - Tích hợp Form Request validation
- 🔒 **Built-in Security** - CORS handling, field filtering, và security controls
- 🎨 **Customizable Hooks** - Lifecycle hooks cho mọi operation
- 📊 **Rich Response Format** - Metadata, pagination links, và structured responses
- 🛡️ **Exception Handling** - Xử lý lỗi chuyên nghiệp với HTTP status codes
- 🔧 **Easy Customization** - Dễ dàng tùy biến và mở rộng

## 🏗️ Kiến trúc

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ApiRoute      │───▶│  ApiController   │───▶│   ApiModel      │
│   (Routing)     │    │   (Logic)        │    │   (Data)        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  ApiRouter      │    │ RequestParser    │    │ ApiResponse     │
│  (Route Mgmt)   │    │ (Query Builder)  │    │ (Response)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Bắt đầu nhanh

### 1. Cài đặt
```bash
composer require froiden/laravel-rest-api
```

### 2. Publish config
```bash
php artisan vendor:publish --provider="Froiden\RestAPI\Providers\ApiServiceProvider"
```

### 3. Tạo Controller
```php
<?php

namespace App\Http\Controllers;

use Froiden\RestAPI\ApiController;
use App\Models\User;

class UserController extends ApiController
{
    protected $model = User::class;
    
    protected function modifyIndex($query)
    {
        // Tùy biến query trước khi thực thi
        return $query->where('is_active', true);
    }
}
```

### 4. Định nghĩa Routes
```php
use Froiden\RestAPI\Facades\ApiRoute;

ApiRoute::middleware(['auth:sanctum'])->group(function () {
    ApiRoute::get('users', [UserController::class, 'index']);
    ApiRoute::get('users/{id}', [UserController::class, 'show']);
    ApiRoute::post('users', [UserController::class, 'store']);
    ApiRoute::put('users/{id}', [UserController::class, 'update']);
    ApiRoute::delete('users/{id}', [UserController::class, 'destroy']);
});
```

## 📚 Tài liệu chi tiết

- [📖 Cài đặt và Cấu hình](INSTALLATION.md)
- [🎯 Khái niệm cốt lõi](CORE_CONCEPTS.md)
- [🎮 ApiController](API_CONTROLLER.md)
- [🗃️ ApiModel](API_MODEL.md)
- [🛣️ Routing System](ROUTING.md)
- [🔍 Request Parsing](REQUEST_PARSING.md)
- [🔧 Hooks và Tùy biến](HOOKS_AND_CUSTOMIZATION.md)
- [⚠️ Exception Handling](EXCEPTION_HANDLING.md)
- [🚀 Tính năng nâng cao](ADVANCED_FEATURES.md)
- [💡 Best Practices](BEST_PRACTICES.md)
- [🔄 Migration Guide](MIGRATION_GUIDE.md)

## 🌟 Ví dụ thực tế

### API Endpoints tự động
```
GET    /api/users              - Lấy danh sách users
GET    /api/users/{id}         - Lấy chi tiết user
POST   /api/users              - Tạo user mới
PUT    /api/users/{id}         - Cập nhật user
DELETE /api/users/{id}         - Xóa user
```

### Query Parameters hỗ trợ
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

## 🤝 Đóng góp

Thư viện này được phát triển bởi Froiden Technologies. Nếu bạn muốn đóng góp hoặc báo cáo vấn đề, vui lòng tạo issue hoặc pull request.

## 📄 License

Thư viện này được phát hành dưới MIT License. Xem file LICENSE để biết thêm chi tiết.

---

**Froiden Laravel REST API** - Xây dựng RESTful API chuyên nghiệp một cách nhanh chóng và hiệu quả! 🚀
