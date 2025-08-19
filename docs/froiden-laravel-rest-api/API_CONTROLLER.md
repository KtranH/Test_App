# ApiController - Hướng dẫn chi tiết

## 🎯 Tổng quan

`ApiController` là class cốt lõi của thư viện, cung cấp tất cả các CRUD operations tự động và các hooks để tùy biến logic nghiệp vụ. Controller này kế thừa từ Laravel's base Controller và mở rộng với các tính năng API chuyên biệt.

## 🚀 Khởi tạo Controller

### Cấu trúc cơ bản

```php
<?php

namespace App\Http\Controllers;

use Froiden\RestAPI\ApiController;
use App\Models\User;

class UserController extends ApiController
{
    protected $model = User::class;
    
    // Cấu hình mặc định
    protected $defaultLimit = 10;
    protected $maxLimit = 100;
    
    // Form Request validation
    protected $indexRequest = \App\Http\Requests\UserIndexRequest::class;
    protected $storeRequest = \App\Http\Requests\UserStoreRequest::class;
    protected $updateRequest = \App\Http\Requests\UserUpdateRequest::class;
    protected $showRequest = \App\Http\Requests\UserShowRequest::class;
    protected $deleteRequest = \App\Http\Requests\UserDeleteRequest::class;
}
```

### Properties cần thiết

| Property | Type | Mô tả | Bắt buộc |
|----------|------|--------|----------|
| `$model` | string | Class name của Model | ✅ |
| `$defaultLimit` | int | Số bản ghi mặc định | ❌ |
| `$maxLimit` | int | Số bản ghi tối đa | ❌ |
| `$exclude` | array | Fields bị loại trừ | ❌ |

## 🔧 CRUD Operations tự động

### 1. Index - Lấy danh sách

```php
// GET /api/users
public function index()
{
    // Tự động xử lý:
    // - Validation
    // - Request parsing
    // - Query building
    // - Pagination
    // - Response formatting
}
```

**Hooks có sẵn:**
- `modifyIndex($query)` - Tùy biến query trước khi thực thi
- `modify()` - Tùy biến chung cho tất cả operations

### 2. Show - Lấy chi tiết

```php
// GET /api/users/{id}
public function show(...$args)
{
    // Tự động xử lý:
    // - ID extraction từ route parameters
    // - Validation
    // - Query building với key constraint
    // - Response formatting
}
```

**Hooks có sẵn:**
- `modifyShow($query)` - Tùy biến query cho show operation

### 3. Store - Tạo mới

```php
// POST /api/users
public function store()
{
    // Tự động xử lý:
    // - Validation
    // - Transaction management
    // - Model creation
    // - Response formatting
}
```

**Hooks có sẵn:**
- `storing($object)` - Trước khi lưu vào database
- `stored($object)` - Sau khi lưu thành công

### 4. Update - Cập nhật

```php
// PUT/PATCH /api/users/{id}
public function update(...$args)
{
    // Tự động xử lý:
    // - ID extraction
    // - Validation
    // - Transaction management
    // - Model update
    // - Response formatting
}
```

**Hooks có sẵn:**
- `modifyUpdate($query)` - Tùy biến query trước khi tìm model
- `updating($object)` - Trước khi cập nhật
- `updated($object)` - Sau khi cập nhật thành công

### 5. Destroy - Xóa

```php
// DELETE /api/users/{id}
public function destroy(...$args)
{
    // Tự động xử lý:
    // - ID extraction
    // - Validation
    // - Transaction management
    // - Model deletion
    // - Response formatting
}
```

**Hooks có sẵn:**
- `modifyDelete($query)` - Tùy biến query trước khi tìm model
- `destroying($object)` - Trước khi xóa
- `destroyed($object)` - Sau khi xóa thành công

## 🎮 Lifecycle Hooks

### Query Modification Hooks

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Tùy biến query cho index operation
     */
    protected function modifyIndex($query)
    {
        // Chỉ lấy users đang hoạt động
        return $query->where('is_active', true);
    }
    
    /**
     * Tùy biến query cho show operation
     */
    protected function modifyShow($query)
    {
        // Thêm eager loading cho relations
        return $query->with(['profile', 'roles']);
    }
    
    /**
     * Tùy biến query cho update operation
     */
    protected function modifyUpdate($query)
    {
        // Thêm điều kiện bảo mật
        return $query->where('is_deleted', false);
    }
    
    /**
     * Tùy biến query cho delete operation
     */
    protected function modifyDelete($query)
    {
        // Kiểm tra quyền xóa
        return $query->where('can_be_deleted', true);
    }
}
```

### Model Lifecycle Hooks

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Trước khi tạo user mới
     */
    protected function storing(User $user): User
    {
        // Hash password
        if (isset($user->password)) {
            $user->password = Hash::make($user->password);
        }
        
        // Set default values
        $user->is_active = true;
        $user->email_verified_at = now();
        
        return $user;
    }
    
    /**
     * Sau khi tạo user thành công
     */
    protected function stored(User $user): void
    {
        // Gửi email chào mừng
        Mail::to($user->email)->send(new WelcomeEmail($user));
        
        // Tạo profile mặc định
        $user->profile()->create([
            'bio' => 'Welcome to our platform!'
        ]);
    }
    
    /**
     * Trước khi cập nhật user
     */
    protected function updating(User $user): User
    {
        // Hash password nếu có thay đổi
        if ($user->isDirty('password')) {
            $user->password = Hash::make($user->password);
        }
        
        return $user;
    }
    
    /**
     * Sau khi cập nhật user thành công
     */
    protected function updated(User $user): void
    {
        // Log thay đổi
        activity()
            ->performedOn($user)
            ->log('User updated');
    }
    
    /**
     * Trước khi xóa user
     */
    protected function destroying(User $user): User
    {
        // Soft delete thay vì hard delete
        $user->deleted_at = now();
        $user->save();
        
        return $user;
    }
    
    /**
     * Sau khi xóa user thành công
     */
    protected function destroyed(User $user): void
    {
        // Gửi email thông báo
        Mail::to($user->email)->send(new AccountDeletedEmail($user));
    }
}
```

## 🔍 Request Validation

### Form Request Classes

```php
// app/Http/Requests/UserStoreRequest.php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }
    
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id'
        ];
    }
    
    public function messages()
    {
        return [
            'name.required' => 'Tên người dùng là bắt buộc',
            'email.unique' => 'Email đã tồn tại trong hệ thống'
        ];
    }
}
```

### Controller Configuration

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    // Form Request validation
    protected $storeRequest = \App\Http\Requests\UserStoreRequest::class;
    protected $updateRequest = \App\Http\Requests\UserUpdateRequest::class;
    protected $indexRequest = \App\Http\Requests\UserIndexRequest::class;
    protected $showRequest = \App\Http\Requests\UserShowRequest::class;
    protected $deleteRequest = \App\Http\Requests\UserDeleteRequest::class;
}
```

## 🛡️ Security và Authorization

### Authorization với Policies

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Tùy biến index với authorization
     */
    protected function modifyIndex($query)
    {
        // Kiểm tra quyền xem danh sách users
        $this->authorize('viewAny', User::class);
        
        // Chỉ admin mới thấy tất cả users
        if (!auth()->user()->hasRole('admin')) {
            $query->where('created_by', auth()->id());
        }
        
        return $query;
    }
    
    /**
     * Tùy biến show với authorization
     */
    protected function modifyShow($query)
    {
        // Kiểm tra quyền xem user cụ thể
        $id = request()->route('id');
        $user = User::findOrFail($id);
        $this->authorize('view', $user);
        
        return $query;
    }
    
    /**
     * Authorization cho store operation
     */
    protected function storing(User $user): User
    {
        $this->authorize('create', User::class);
        return $user;
    }
    
    /**
     * Authorization cho update operation
     */
    protected function updating(User $user): User
    {
        $this->authorize('update', $user);
        return $user;
    }
    
    /**
     * Authorization cho delete operation
     */
    protected function destroying(User $user): User
    {
        $this->authorize('delete', $user);
        return $user;
    }
}
```

### Field Filtering

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Loại trừ sensitive fields
     */
    protected $exclude = ['_token', 'password_confirmation', 'remember_token'];
    
    /**
     * Tùy biến fields trả về dựa trên role
     */
    protected function modifyIndex($query)
    {
        $user = auth()->user();
        
        if ($user->hasRole('admin')) {
            // Admin thấy tất cả fields
            return $query;
        } else {
            // User thường chỉ thấy fields cơ bản
            request()->merge(['fields' => 'id,name,email,created_at']);
            return $query;
        }
    }
}
```

## 📊 Custom Methods

### Thêm business logic tùy chỉnh

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Lấy danh sách users theo department
     */
    public function byDepartment($departmentId)
    {
        $this->authorize('viewAny', User::class);
        
        $users = User::where('department_id', $departmentId)
            ->with(['profile', 'roles'])
            ->paginate(request('limit', $this->defaultLimit));
            
        return ApiResponse::make(null, $users->items(), [
            'total' => $users->total(),
            'current_page' => $users->currentPage(),
            'per_page' => $users->perPage()
        ]);
    }
    
    /**
     * Bulk update users
     */
    public function bulkUpdate(Request $request)
    {
        $this->authorize('updateAny', User::class);
        
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'updates' => 'required|array'
        ]);
        
        DB::transaction(function () use ($request) {
            User::whereIn('id', $request->user_ids)
                ->update($request->updates);
        });
        
        return ApiResponse::make('Users updated successfully');
    }
    
    /**
     * Export users to CSV
     */
    public function export(Request $request)
    {
        $this->authorize('export', User::class);
        
        $users = $this->parseRequest()
            ->addFilters()
            ->addOrdering()
            ->getResults();
            
        return response()->streamDownload(function () use ($users) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Name', 'Email', 'Created At']);
            
            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->created_at
                ]);
            }
            
            fclose($file);
        }, 'users.csv');
    }
}
```

## 🔧 Advanced Configuration

### Custom Query Builder

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Tùy biến query builder cho tất cả operations
     */
    protected function modify($query)
    {
        // Thêm global scopes
        $query->withoutTrashed();
        
        // Thêm default ordering
        if (!$this->parser->getOrder()) {
            $query->orderBy('created_at', 'desc');
        }
        
        return $query;
    }
    
    /**
     * Tùy biến response metadata
     */
    protected function getMetaData($single = false)
    {
        $meta = parent::getMetaData($single);
        
        // Thêm custom metadata
        $meta['filters_applied'] = $this->parser->getFilters();
        $meta['user_role'] = auth()->user()->role;
        
        return $meta;
    }
}
```

### Error Handling

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Custom error handling cho specific operations
     */
    protected function storing(User $user): User
    {
        try {
            // Business logic
            $user = $this->processUserData($user);
            
        } catch (UserCreationException $e) {
            // Log error
            Log::error('User creation failed', [
                'email' => $user->email,
                'error' => $e->getMessage()
            ]);
            
            // Re-throw để ApiExceptionHandler xử lý
            throw $e;
        }
        
        return $user;
    }
    
    /**
     * Custom validation logic
     */
    protected function validate()
    {
        parent::validate();
        
        // Additional validation
        if (request()->isMethod('POST')) {
            $this->validateUserQuota();
        }
    }
    
    private function validateUserQuota()
    {
        $currentCount = User::count();
        $maxUsers = config('app.max_users', 1000);
        
        if ($currentCount >= $maxUsers) {
            throw new UserQuotaExceededException('User quota exceeded');
        }
    }
}
```

## 📚 Best Practices

### 1. Controller Organization
- **Single Responsibility**: Mỗi controller chỉ xử lý một resource
- **Hook Usage**: Sử dụng hooks thay vì override methods
- **Validation**: Luôn sử dụng Form Request validation

### 2. Security
- **Authorization**: Kiểm tra quyền trong mọi operation
- **Field Filtering**: Chỉ expose fields cần thiết
- **Input Sanitization**: Validate và sanitize tất cả input

### 3. Performance
- **Eager Loading**: Sử dụng `with()` để tránh N+1 queries
- **Query Optimization**: Tối ưu queries trong modify hooks
- **Caching**: Implement caching cho expensive operations

### 4. Error Handling
- **Custom Exceptions**: Tạo custom exceptions cho business logic
- **Logging**: Log tất cả errors và important events
- **User Feedback**: Cung cấp error messages rõ ràng

---

🎯 **Tóm tắt**: `ApiController` cung cấp một framework hoàn chỉnh để xây dựng RESTful API với CRUD operations tự động, lifecycle hooks linh hoạt, và security features mạnh mẽ. Sử dụng các hooks và custom methods để tùy biến logic nghiệp vụ theo yêu cầu cụ thể.
