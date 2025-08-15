# CORS Configuration Guide

## Tại sao cần CORS?

Cross-Origin Resource Sharing (CORS) là một cơ chế bảo mật của trình duyệt web cho phép hoặc từ chối các request từ domain khác. Khi frontend và backend ở domain khác nhau (ví dụ: frontend ở `localhost:3000`, backend ở `localhost:8000`), CORS sẽ chặn các request nếu không được cấu hình đúng.

## Cấu hình hiện tại

### 1. File `config/cors.php`
```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

### 2. Middleware trong `bootstrap/app.php`
```php
->withMiddleware(function (Middleware $middleware): void {
    // Bật sanctum middleware
    $middleware->statefulApi();
    
    // Thêm CORS middleware
    $middleware->api([
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
    
    // Thêm CORS middleware cho web routes nếu cần
    $middleware->web([
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
})
```

### 3. Sanctum Configuration (`config/sanctum.php`)
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort(),
))),
```

## Các tùy chọn cấu hình

### 1. Cho Development (Local)
```php
// config/cors.php
'allowed_origins' => [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080'
],
'supports_credentials' => true,
```

### 2. Cho Production
```php
// config/cors.php
'allowed_origins' => [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
],
'allowed_origins_patterns' => [
    'https://*.yourdomain.com'
],
'supports_credentials' => true,
```

### 3. Cho API Only
```php
// config/cors.php
'paths' => ['api/*'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
'allowed_headers' => [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With'
],
```

## Environment Variables

Thêm vào file `.env`:

```env
# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
CORS_ALLOWED_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,Accept,X-Requested-With
CORS_EXPOSED_HEADERS=
CORS_MAX_AGE=0
CORS_SUPPORTS_CREDENTIALS=true

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000
```

## Testing CORS

### 1. Test với cURL
```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  http://localhost:8000/api/v1/auth/login

# Test actual request
curl -X POST \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  http://localhost:8000/api/v1/auth/login
```

### 2. Test với JavaScript (Frontend)
```javascript
// Test CORS
fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
    })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### 3. Test với Postman
- Gửi request đến API endpoint
- Kiểm tra response headers có chứa CORS headers không
- Kiểm tra console browser có lỗi CORS không

## Troubleshooting

### 1. Lỗi "No 'Access-Control-Allow-Origin' header"
- Kiểm tra `allowed_origins` trong `config/cors.php`
- Đảm bảo domain frontend được liệt kê
- Kiểm tra middleware đã được đăng ký

### 2. Lỗi "Method not allowed"
- Kiểm tra `allowed_methods` trong `config/cors.php`
- Đảm bảo HTTP method được cho phép

### 3. Lỗi "Headers not allowed"
- Kiểm tra `allowed_headers` trong `config/cors.php`
- Đảm bảo tất cả headers cần thiết được liệt kê

### 4. Lỗi với Credentials
- Đặt `supports_credentials` thành `true`
- Đảm bảo frontend gửi `credentials: 'include'`
- Kiểm tra `stateful` domains trong Sanctum

## Best Practices

1. **Security**: Không sử dụng `'*'` cho `allowed_origins` trong production
2. **Specificity**: Chỉ cho phép các origins thực sự cần thiết
3. **Headers**: Chỉ cho phép các headers cần thiết
4. **Methods**: Chỉ cho phép các HTTP methods cần thiết
5. **Credentials**: Chỉ bật `supports_credentials` khi cần thiết
6. **Testing**: Test CORS trong cả development và production environments

## Laravel 12 Changes

Trong Laravel 12:
- CORS middleware được tích hợp sẵn
- Cấu hình trong `bootstrap/app.php` thay vì `app/Http/Kernel.php`
- Sử dụng `HandleCors` middleware class
- CORS config file được tạo thủ công nếu cần

## Kết luận

CORS configuration rất quan trọng cho API development. Với cấu hình hiện tại, API của bạn sẽ hoạt động với frontend ở các domain khác nhau. Hãy điều chỉnh cấu hình theo nhu cầu cụ thể của dự án.
