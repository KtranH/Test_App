# Hệ Thống Phân Quyền Đơn Giản

## Tổng Quan

Hệ thống phân quyền được thiết kế đơn giản và dễ hiểu cho ứng dụng nhỏ với 3 role chính:

- **user**: Chỉ có thể đăng nhập và xem thông tin
- **admin**: Có thể CRUD user nhưng không thể tác động với admin khác
- **super_admin**: Toàn quyền

## Cấu Trúc

### 1. User Model (`app/Models/User.php`)
**Helper Methods cho Role:**
```php
$user->isUser()           // Kiểm tra có phải user thường
$user->isAdmin()          // Kiểm tra có phải admin  
$user->isSuperAdmin()     // Kiểm tra có phải super admin
$user->canManage()        // Kiểm tra có quyền quản lý (admin/super_admin)
$user->hasRole('admin')   // Kiểm tra role cụ thể
$user->hasAnyRole(['admin', 'super_admin'])  // Kiểm tra nhiều role
$user->canManageUser($targetUser)  // Kiểm tra có thể manage user khác
```

### 2. UserPolicy (`app/Policies/UserPolicy.php`)
**Logic Phân Quyền Chi Tiết:**

| Action | User | Admin | Super Admin |
|--------|------|-------|-------------|
| viewAny | ✅ | ✅ | ✅ |
| view | Chỉ chính mình | Tất cả | Tất cả |
| create | ❌ | ✅ | ✅ |
| update | Chỉ chính mình | Không admin khác | Tất cả |
| delete | ❌ | Chỉ user thường | Tất cả (trừ chính mình) |

### 3. RoleMiddleware (`app/Http/Middleware/RoleMiddleware.php`)
**Middleware Check Role Cơ Bản:**
```php
// Sử dụng trong route
Route::middleware('role:admin,super_admin')->group(function () {
    // Chỉ admin và super_admin truy cập được
});

Route::middleware('role:admin')->get('/admin-only', function () {
    // Chỉ admin truy cập được
});
```

### 4. UserController (`app/Http/Controllers/UserController.php`)
**Authorization trong Controller:**
```php
public function index()
{
    $this->authorize('viewAny', User::class);  // Policy check
    return parent::index();
}

public function show($id)
{
    $user = User::findOrFail($id);
    $this->authorize('view', $user);  // Policy check với model cụ thể
    return parent::show($id);
}
```

## Cách Sử Dụng

### Phân Quyền API Endpoints

**GET /api/users** - Xem danh sách
- ✅ user: Có thể gọi (nhưng policy sẽ filter)
- ✅ admin: Xem tất cả
- ✅ super_admin: Xem tất cả

**GET /api/users/{id}** - Xem chi tiết
- ✅ user: Chỉ xem được chính mình
- ✅ admin: Xem được tất cả
- ✅ super_admin: Xem được tất cả

**POST /api/users** - Tạo user
- ❌ user: Không được phép (middleware block)
- ✅ admin: Được phép
- ✅ super_admin: Được phép

**PUT/PATCH /api/users/{id}** - Cập nhật
- ✅ user: Chỉ cập nhật được chính mình
- ✅ admin: Cập nhật được user thường (không admin khác)
- ✅ super_admin: Cập nhật được tất cả

**DELETE /api/users/{id}** - Xóa
- ❌ user: Không được phép
- ✅ admin: Chỉ xóa được user thường
- ✅ super_admin: Xóa được tất cả (trừ chính mình)

### Response Format khi bị từ chối
```json
{
    "success": false,
    "message": "Insufficient permissions - Không đủ quyền truy cập",
    "required_roles": ["admin", "super_admin"],
    "user_role": "user"
}
```

## Tạo User Với Role

```php
// Tạo user thường
User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => 'password123',
    'role' => 'user',
    'status' => 'active'
]);

// Tạo admin
User::create([
    'name' => 'Admin User',
    'email' => 'admin@example.com', 
    'password' => 'admin123',
    'role' => 'admin',
    'status' => 'active'
]);

// Tạo super admin
User::create([
    'name' => 'Super Admin',
    'email' => 'super@example.com',
    'password' => 'super123', 
    'role' => 'super_admin',
    'status' => 'active'
]);
```

## Testing

### Test Scenarios
1. **User thường** login và thử:
   - ✅ Xem profile của chính mình
   - ❌ Xem profile user khác
   - ❌ Tạo user mới
   - ❌ Xóa user

2. **Admin** login và thử:
   - ✅ Xem tất cả user
   - ✅ Tạo user mới
   - ✅ Sửa user thường
   - ❌ Sửa admin khác
   - ✅ Xóa user thường
   - ❌ Xóa admin khác

3. **Super Admin** login và thử:
   - ✅ Làm tất cả (trừ xóa chính mình)

## Ưu Điểm Của Cách Tiếp Cận Này

1. **Đơn giản**: Dễ hiểu và implement
2. **Linh hoạt**: Policy cho logic phức tạp, Middleware cho check nhanh
3. **Maintainable**: Logic tập trung, dễ sửa
4. **Testable**: Có thể test từng phần riêng biệt
5. **Secure**: Double-check với cả middleware và policy

## Mở Rộng

Nếu cần thêm permission phức tạp hơn, có thể:
1. Thêm table `permissions` và `role_permissions`
2. Sử dụng package như `spatie/laravel-permission`
3. Tạo thêm Gates cho logic business cụ thể

Nhưng với app nhỏ, cách hiện tại đã đủ và hiệu quả.
