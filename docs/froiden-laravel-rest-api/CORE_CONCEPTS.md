# Khái niệm cốt lõi

## 🎯 Tổng quan kiến trúc

Froiden Laravel REST API được xây dựng dựa trên kiến trúc **Model-View-Controller (MVC)** với các thành phần chuyên biệt cho API development. Thư viện tự động hóa các thao tác CRUD cơ bản và cung cấp các hooks để tùy biến logic nghiệp vụ.

## 🏗️ Các thành phần chính

### 1. ApiController
- **Vai trò**: Xử lý logic nghiệp vụ và điều phối request/response
- **Chức năng**: Tự động tạo CRUD operations, validation, và response formatting
- **Kế thừa**: `\Illuminate\Routing\Controller`

### 2. ApiModel
- **Vai trò**: Định nghĩa cấu trúc dữ liệu và business rules
- **Chức năng**: Field visibility, filtering, relations, và data transformation
- **Kế thừa**: `Illuminate\Database\Eloquent\Model`

### 3. ApiRoute
- **Vai trò**: Facade để đăng ký API routes
- **Chức năng**: Tự động thêm middleware, versioning, và prefix
- **Tích hợp**: Laravel Router với các tính năng bổ sung

### 4. RequestParser
- **Vai trò**: Phân tích và xử lý query parameters
- **Chức năng**: Parsing fields, filters, sorting, pagination, và relations
- **Output**: Eloquent Query Builder được tối ưu

### 5. ApiResponse
- **Vai trò**: Format response theo chuẩn API
- **Chức năng**: Structured JSON với metadata, pagination, và error handling
- **Tùy biến**: Message, data, và meta information

## 🔄 Flow xử lý request

```
Request → ApiRoute → ApiController → RequestParser → ApiModel → Database
   ↓
Response ← ApiResponse ← ApiController ← Eloquent Query ← Query Builder
```

### Chi tiết từng bước:

1. **Request đến**: Client gửi HTTP request với query parameters
2. **Route matching**: ApiRoute xác định controller và method
3. **Middleware**: ApiMiddleware xử lý CORS và security
4. **Controller**: ApiController nhận request và khởi tạo logic
5. **Validation**: Kiểm tra Form Request classes (nếu có)
6. **Parsing**: RequestParser phân tích query parameters
7. **Query Building**: Xây dựng Eloquent query với filters, includes, etc.
8. **Hooks**: Gọi các lifecycle hooks (modifyIndex, storing, etc.)
9. **Execution**: Thực thi query và xử lý dữ liệu
10. **Response**: Format response qua ApiResponse

## 🎮 Lifecycle Hooks

### Index Operation
```
modifyIndex() → addIncludes() → addFilters() → addOrdering() → addPaging() → modify() → getResults()
```

### Store Operation
```
validate() → storing() → save() → stored()
```

### Update Operation
```
validate() → modifyUpdate() → updating() → save() → updated()
```

### Delete Operation
```
validate() → modifyDelete() → destroying() → delete() → destroyed()
```

## 🔍 Request Parameters

### Fields Parameter
```
?fields=id,name,email,profile{avatar,bio}
```
- **Mục đích**: Chỉ định fields cần trả về
- **Cú pháp**: Field names phân cách bởi dấu phẩy
- **Nested**: Sử dụng `{}` cho relations

### Filters Parameter
```
?filters=(is_active eq true) and (created_at gt "2024-01-01")
```
- **Operators**: `eq`, `ne`, `gt`, `ge`, `lt`, `le`, `lk` (like)
- **Logic**: `and`, `or` để kết hợp conditions
- **Values**: String, numbers, dates, null

### Order Parameter
```
?order=name asc,created_at desc
```
- **Format**: `field direction`
- **Direction**: `asc` (ascending), `desc` (descending)
- **Multiple**: Phân cách bởi dấu phẩy

### Pagination Parameters
```
?limit=20&offset=40
```
- **limit**: Số bản ghi mỗi trang
- **offset**: Vị trí bắt đầu (zero-based)

### Includes Parameter
```
?includes=profile,posts{id,title,created_at}
```
- **Mục đích**: Eager load relations
- **Nested**: Sử dụng `{}` để chỉ định fields của relation

## 📊 Response Structure

### Success Response
```json
{
    "message": "Resource created successfully",
    "data": {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "meta": {
        "total": 1,
        "limit": 10,
        "offset": 0,
        "queries": 2,
        "processing_time": 0.045
    }
}
```

### Error Response
```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "The given data was invalid.",
        "details": {
            "email": ["The email field is required."]
        }
    },
    "status_code": 422
}
```

## 🛡️ Security Features

### 1. Field Filtering
- **Model level**: Chỉ fields trong `$default` array được trả về
- **Request level**: Client có thể override qua `fields` parameter
- **Hidden fields**: Fields trong `$hidden` array luôn bị ẩn

### 2. Filterable Fields
- **Whitelist**: Chỉ fields trong `$filterable` array mới được filter
- **Security**: Ngăn chặn SQL injection qua arbitrary field filtering

### 3. CORS Protection
- **Automatic**: Tự động thêm CORS headers
- **Configurable**: Có thể tắt hoặc tùy chỉnh qua config

### 4. Input Validation
- **Form Requests**: Tích hợp với Laravel Form Request validation
- **Sanitization**: Tự động loại bỏ các field không mong muốn

## 🔧 Customization Points

### 1. Controller Level
- **Lifecycle hooks**: `storing()`, `updating()`, `destroying()`, etc.
- **Query modification**: `modifyIndex()`, `modifyShow()`, etc.
- **Custom methods**: Thêm business logic tùy chỉnh

### 2. Model Level
- **Field visibility**: `$default`, `$hidden`, `$appends`
- **Filtering rules**: `$filterable`, `$relationKeys`
- **Data transformation**: `serializeDate()`, custom accessors

### 3. Route Level
- **Middleware**: Authentication, authorization, rate limiting
- **Versioning**: API versioning với prefix
- **Grouping**: Logical grouping của related endpoints

## 🚀 Performance Features

### 1. Query Optimization
- **Eager Loading**: Tự động `with()` relations
- **Field Selection**: Chỉ select fields cần thiết
- **Indexing**: Hỗ trợ database indexing strategies

### 2. Caching
- **Query Logging**: Debug mode để analyze performance
- **Response Caching**: Có thể tích hợp với Laravel cache
- **Database Caching**: Query result caching

### 3. Pagination
- **Efficient**: Sử dụng `offset` và `limit` thay vì `skip()` và `take()`
- **Metadata**: Cung cấp thông tin pagination đầy đủ
- **Links**: Previous/next links cho navigation

## 📚 Best Practices

### 1. Controller Design
- **Single Responsibility**: Mỗi controller chỉ xử lý một resource
- **Hook Usage**: Sử dụng hooks thay vì override methods
- **Validation**: Luôn sử dụng Form Request validation

### 2. Model Configuration
- **Field Selection**: Chỉ expose fields cần thiết
- **Relations**: Định nghĩa relations rõ ràng
- **Security**: Cẩn thận với `$filterable` fields

### 3. Route Organization
- **Logical Grouping**: Nhóm related endpoints
- **Middleware**: Áp dụng middleware phù hợp
- **Versioning**: Sử dụng versioning cho backward compatibility

---

🎯 **Tóm tắt**: Froiden Laravel REST API cung cấp một framework hoàn chỉnh để xây dựng RESTful API với kiến trúc rõ ràng, hooks linh hoạt, và security features mạnh mẽ. Thư viện tự động hóa các thao tác cơ bản và cho phép developer tập trung vào business logic.
