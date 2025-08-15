# API Documentation Component

## Tổng Quan
Component `apiUser.vue` cung cấp giao diện documentation đầy đủ cho các API endpoint quản lý user, giúp developers hiểu rõ cách sử dụng API.

## Tính Năng Chính

### 1. **API Overview Section**
- **Base URL**: `/api/users`
- **Authentication**: Bearer Token
- **Format**: JSON
- Giao diện gradient đẹp mắt với icons

### 2. **Interactive Endpoints**
Mỗi endpoint có thể mở/đóng để xem chi tiết:

#### **GET /users** - Phân trang danh sách user
- **Parameters**: `limit`, `offset`, `filter`
- **Example Request**: Code sample với headers
- **Response**: JSON response structure
- **Color**: Green badge

#### **GET /users?filters=...** - Tìm kiếm user
- **Filter Syntax**: Giải thích cú pháp `name lk "query%" or email lk "query%"`
- **Operators**: `lk` (like), `%` (wildcard)
- **Color**: Blue badge

#### **POST /users** - Tạo user mới
- **Request Body**: JSON structure
- **Example Request**: Full HTTP request
- **Color**: Yellow badge

#### **PUT /users/{id}** - Cập nhật user
- **Request Body**: Partial update fields
- **Example Request**: HTTP PUT request
- **Color**: Purple badge

#### **DELETE /users/{id}** - Xóa user
- **Example Request**: HTTP DELETE request
- **Response**: Success message
- **Color**: Red badge

### 3. **HTTP Status Codes**
- **Success Codes**: 200, 201, 204
- **Error Codes**: 400, 401, 500
- Mỗi code có màu sắc và mô tả rõ ràng

### 4. **Interactive Features**
- **Collapsible Sections**: Click để mở/đóng chi tiết
- **Syntax Highlighting**: Code samples với màu sắc
- **Responsive Design**: Hoạt động tốt trên mobile
- **Visual Indicators**: Icons và màu sắc phân biệt

## Cấu Trúc Component

### Template Structure
```vue
<template>
  <div class="space-y-6">
    <!-- API Overview -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50">
      <!-- Header với icon và description -->
      <!-- Info cards: Base URL, Auth, Format -->
    </div>

    <!-- API Endpoints -->
    <div class="space-y-4">
      <!-- Mỗi endpoint là một collapsible card -->
      <div class="border border-gray-200 rounded-lg">
        <!-- Header với HTTP method, path, description -->
        <!-- Expandable content với parameters, examples, responses -->
      </div>
    </div>

    <!-- Status Codes -->
    <div class="bg-gray-50 rounded-lg">
      <!-- Grid layout cho các HTTP status codes -->
    </div>
  </div>
</template>
```

### Script Logic
```javascript
<script setup>
import { ref } from 'vue'

// State management cho việc mở/đóng endpoints
const expandedEndpoints = ref({
  getUsers: false,
  searchUsers: false,
  createUser: false,
  updateUser: false,
  deleteUser: false
})

// Toggle function
const toggleEndpoint = (endpoint) => {
  expandedEndpoints.value[endpoint] = !expandedEndpoints.value[endpoint]
}
</script>
```

## Styling & Design

### Color Scheme
- **GET**: Green (`bg-green-100 text-green-800`)
- **POST**: Yellow (`bg-yellow-100 text-yellow-800`)
- **PUT**: Purple (`bg-purple-100 text-purple-800`)
- **DELETE**: Red (`bg-red-100 text-red-800`)

### Visual Elements
- **Gradient Backgrounds**: Blue gradient cho overview
- **Icons**: SVG icons cho visual appeal
- **Cards**: Consistent card design với borders
- **Code Blocks**: Dark theme cho code samples

### Responsive Design
- **Grid Layouts**: Responsive grid cho info cards
- **Mobile Friendly**: Stack layout trên mobile
- **Touch Friendly**: Large touch targets cho mobile

## Sử Dụng

### 1. **Import Component**
```javascript
import ApiUser from '@/components/User/apiUser.vue'
```

### 2. **Sử Dụng trong Template**
```vue
<template>
  <div class="card">
    <ApiUser />
  </div>
</template>
```

### 3. **Customization**
Component có thể dễ dàng customize:
- Thay đổi màu sắc
- Thêm endpoints mới
- Sửa đổi content
- Thêm tính năng mới

## Lợi Ích

### 1. **Developer Experience**
- **Clear Documentation**: API docs rõ ràng, dễ hiểu
- **Interactive**: Có thể mở/đóng để xem chi tiết
- **Visual**: Màu sắc và icons giúp dễ nhớ

### 2. **Maintenance**
- **Centralized**: Tất cả API docs ở một nơi
- **Updatable**: Dễ dàng cập nhật khi API thay đổi
- **Consistent**: Format nhất quán cho tất cả endpoints

### 3. **User Experience**
- **Professional**: Giao diện chuyên nghiệp
- **Accessible**: Dễ sử dụng trên mọi thiết bị
- **Informative**: Cung cấp đầy đủ thông tin cần thiết

## Tương Lai

### 1. **Tính Năng Mới**
- **Copy to Clipboard**: Copy code samples
- **Try it Out**: Test API trực tiếp từ docs
- **Search**: Tìm kiếm trong documentation
- **Export**: Export docs ra PDF/HTML

### 2. **Integration**
- **Swagger/OpenAPI**: Import từ OpenAPI spec
- **Real-time**: Sync với API changes
- **Analytics**: Track usage patterns
- **Feedback**: User feedback system

### 3. **Advanced Features**
- **Versioning**: Support multiple API versions
- **Authentication**: Test với real tokens
- **Rate Limiting**: Show rate limit info
- **Error Handling**: Detailed error examples
