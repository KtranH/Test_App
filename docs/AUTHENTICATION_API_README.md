# API Authentication Documentation

## Tổng quan
API authentication được xây dựng kết hợp giữa thư viện `laravel-rest-api` và custom logic trong `AuthController`. Điều này cho phép tận dụng các tính năng có sẵn của thư viện trong khi vẫn có thể custom các chức năng authentication theo yêu cầu cụ thể.

## Endpoints

### 1. Đăng ký (Register)
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "user",
    "status": "active"
}
```

**Response (201):**
```json
{
    "status": "success",
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "Nguyễn Văn A",
            "email": "nguyenvana@example.com",
            "role": "user",
            "status": "active"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

### 2. Đăng nhập (Login)
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
    "email": "nguyenvana@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "Nguyễn Văn A",
            "email": "nguyenvana@example.com",
            "role": "user",
            "status": "active"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

### 3. Lấy thông tin user hiện tại (Me)
```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "User profile retrieved successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "Nguyễn Văn A",
            "email": "nguyenvana@example.com",
            "role": "user",
            "status": "active",
            "created_at": "2024-01-01T00:00:00.000000Z"
        }
    }
}
```

### 4. Refresh Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer {token}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Token refreshed successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "Nguyễn Văn A",
            "email": "nguyenvana@example.com",
            "role": "user",
            "status": "active"
        },
        "token": "2|def456...",
        "token_type": "Bearer"
    }
}
```

### 5. Thay đổi mật khẩu
```http
POST /api/v1/auth/change-password
Authorization: Bearer {token}
```

**Request Body:**
```json
{
    "current_password": "password123",
    "new_password": "newpassword123",
    "new_password_confirmation": "newpassword123"
}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Password changed successfully"
}
```

### 6. Đăng xuất (Logout)
```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Logged out successfully"
}
```

## Sử dụng Token

Sau khi đăng nhập hoặc đăng ký thành công, bạn sẽ nhận được một Bearer token. Sử dụng token này trong header `Authorization` cho các request cần xác thực:

```http
Authorization: Bearer {your_token_here}
```

## Error Responses

### Validation Error (422)
```json
{
    "status": "error",
    "message": "Validation failed",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    }
}
```

### Authentication Error (401)
```json
{
    "status": "error",
    "message": "Invalid credentials"
}
```

### Authorization Error (403)
```json
{
    "status": "error",
    "message": "Account is not active"
}
```

### Server Error (500)
```json
{
    "status": "error",
    "message": "Login failed: {error_message}"
}
```

## Tính năng bảo mật

1. **Password Hashing**: Mật khẩu được hash bằng Laravel's Hash facade
2. **Token-based Authentication**: Sử dụng Laravel Sanctum cho API tokens
3. **Account Status Check**: Chỉ cho phép đăng nhập với tài khoản có status "active"
4. **Input Validation**: Validate tất cả input với Laravel Validator
5. **Logging**: Ghi log tất cả các hoạt động authentication
6. **Token Revocation**: Xóa token khi logout hoặc refresh

## Middleware

- `api`: Xử lý API requests
- `auth:sanctum`: Bảo vệ các routes cần xác thực

## Tích hợp với Laravel REST API

Thư viện `laravel-rest-api` cung cấp:
- **ApiResponse**: Standardized response format
- **ApiModel**: Enhanced model với filtering, pagination
- **ApiRoute**: API routing với middleware support
- **Validation**: Tự động validation dựa trên model rules

## Testing

Để test API, bạn có thể sử dụng:

1. **Postman/Insomnia**: Test các endpoints
2. **Laravel Tinker**: Test models và relationships
3. **Unit Tests**: Test individual methods
4. **Feature Tests**: Test complete API flows

## Ví dụ sử dụng với JavaScript/Frontend

```javascript
// Đăng nhập
const login = async (email, password) => {
    const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
        // Lưu token
        localStorage.setItem('token', data.data.token);
        return data.data.user;
    } else {
        throw new Error(data.message);
    }
};

// Sử dụng token cho request được bảo vệ
const getProfile = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('/api/v1/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });
    
    return response.json();
};
```

## Lưu ý quan trọng

1. **Token Expiration**: Tokens không có thời hạn, cần implement refresh logic
2. **Rate Limiting**: Có thể thêm rate limiting cho các endpoints authentication
3. **CORS**: Cấu hình CORS nếu frontend và backend ở domain khác nhau
4. **Security Headers**: Thêm security headers cho production
5. **Monitoring**: Monitor failed login attempts và suspicious activities
