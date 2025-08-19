# Hooks và Tùy biến

## Tổng quan

Thư viện `froiden/laravel-rest-api` cung cấp một hệ thống hooks mạnh mẽ cho phép bạn tùy biến hành vi của API mà không cần ghi đè các phương thức cốt lõi. Các hooks này được gọi tại các điểm cụ thể trong vòng đời của request, cho phép bạn thêm logic tùy chỉnh một cách linh hoạt.

## Lifecycle Hooks

### 1. Query Modification Hooks

#### `modifyIndex($query)`
Được gọi trước khi thực hiện query cho danh sách dữ liệu.

```php
protected function modifyIndex($query)
{
    // Thêm điều kiện lọc
    $query->where('status', 'active');
    
    // Thêm sắp xếp mặc định
    $query->orderBy('created_at', 'desc');
    
    return $query;
}
```

#### `modifyShow($query)`
Được gọi trước khi thực hiện query cho một item cụ thể.

```php
protected function modifyShow($query)
{
    // Thêm điều kiện kiểm tra quyền
    $query->where('user_id', auth()->id());
    
    return $query;
}
```

#### `modify($query, $type)`
Hook tổng quát cho tất cả các loại query.

```php
protected function modify($query, $type)
{
    switch ($type) {
        case 'index':
            $query->where('is_public', true);
            break;
        case 'show':
            $query->with(['comments', 'author']);
            break;
    }
    
    return $query;
}
```

### 2. Data Modification Hooks

#### `storing($data)`
Được gọi trước khi lưu dữ liệu mới.

```php
protected function storing($data)
{
    // Thêm thông tin người tạo
    $data['created_by'] = auth()->id();
    $data['created_at'] = now();
    
    // Mã hóa mật khẩu
    if (isset($data['password'])) {
        $data['password'] = Hash::make($data['password']);
    }
    
    return $data;
}
```

#### `updating($data, $item)`
Được gọi trước khi cập nhật dữ liệu.

```php
protected function updating($data, $item)
{
    // Thêm thông tin người cập nhật
    $data['updated_by'] = auth()->id();
    $data['updated_at'] = now();
    
    // Kiểm tra quyền cập nhật
    if (!$this->canUpdate($item)) {
        throw new UnauthorizedException('Không có quyền cập nhật item này');
    }
    
    return $data;
}
```

#### `destroying($item)`
Được gọi trước khi xóa dữ liệu.

```php
protected function destroying($item)
{
    // Kiểm tra quyền xóa
    if (!$this->canDelete($item)) {
        throw new UnauthorizedException('Không có quyền xóa item này');
    }
    
    // Thực hiện soft delete thay vì hard delete
    $item->deleted_at = now();
    $item->deleted_by = auth()->id();
    $item->save();
    
    // Trả về false để ngăn không cho xóa thật
    return false;
}
```

### 3. Response Modification Hooks

#### `modifyResponse($response, $type)`
Tùy chỉnh response trước khi trả về.

```php
protected function modifyResponse($response, $type)
{
    switch ($type) {
        case 'index':
            // Thêm thông tin phân trang
            $response['meta']['total_pages'] = ceil($response['meta']['total'] / $response['meta']['per_page']);
            break;
        case 'show':
            // Thêm thông tin bổ sung
            $response['data']['related_items'] = $this->getRelatedItems($response['data']['id']);
            break;
    }
    
    return $response;
}
```

#### `modifyIndexResponse($response)`
Tùy chỉnh response cho danh sách.

```php
protected function modifyIndexResponse($response)
{
    // Thêm thống kê
    $response['meta']['stats'] = [
        'total_active' => $this->model::where('status', 'active')->count(),
        'total_inactive' => $this->model::where('status', 'inactive')->count(),
    ];
    
    return $response;
}
```

#### `modifyShowResponse($response)`
Tùy chỉnh response cho một item.

```php
protected function modifyShowResponse($response)
{
    // Thêm thông tin audit
    $response['data']['audit'] = [
        'created_by' => $response['data']['created_by'],
        'created_at' => $response['data']['created_at'],
        'last_modified' => $response['data']['updated_at'],
    ];
    
    return $response;
}
```

## Custom Hooks

### Tạo Hook Tùy chỉnh

Bạn có thể tạo các hook tùy chỉnh bằng cách override các phương thức trong controller:

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    // Hook tùy chỉnh cho việc xác thực
    protected function beforeAction($action)
    {
        // Kiểm tra quyền truy cập
        if (!auth()->check()) {
            throw new UnauthorizedException('Vui lòng đăng nhập');
        }
        
        // Log hoạt động
        Log::info("User {$action} action", [
            'user_id' => auth()->id(),
            'action' => $action,
            'timestamp' => now()
        ]);
    }
    
    // Hook sau khi thực hiện action
    protected function afterAction($action, $result)
    {
        // Gửi notification
        if ($action === 'store') {
            event(new UserCreated($result));
        }
        
        // Cập nhật cache
        Cache::tags(['users'])->flush();
    }
}
```

### Hook với Middleware

Bạn có thể sử dụng middleware để thực hiện các hook:

```php
class ApiLoggingMiddleware
{
    public function handle($request, Closure $next)
    {
        $startTime = microtime(true);
        
        $response = $next($request);
        
        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;
        
        Log::info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'duration_ms' => round($duration, 2),
            'status' => $response->getStatusCode()
        ]);
        
        return $response;
    }
}
```

## Advanced Customization

### 1. Custom Query Builders

```php
protected function buildCustomQuery($type)
{
    $query = $this->model::query();
    
    switch ($type) {
        case 'active_users':
            $query->where('status', 'active')
                  ->where('last_login_at', '>=', now()->subDays(30));
            break;
        case 'premium_users':
            $query->where('subscription_type', 'premium')
                  ->where('subscription_expires_at', '>', now());
            break;
    }
    
    return $query;
}
```

### 2. Custom Validation Rules

```php
protected function getCustomValidationRules($action)
{
    $rules = [];
    
    switch ($action) {
        case 'store':
            $rules['email'] = 'required|email|unique:users,email';
            $rules['password'] = 'required|min:8|confirmed';
            break;
        case 'update':
            $rules['email'] = 'required|email|unique:users,email,' . $this->getItemId();
            $rules['password'] = 'nullable|min:8|confirmed';
            break;
    }
    
    return $rules;
}
```

### 3. Custom Response Format

```php
protected function formatResponse($data, $type)
{
    switch ($type) {
        case 'index':
            return [
                'success' => true,
                'data' => $data,
                'pagination' => $this->getPaginationInfo(),
                'filters' => $this->getAppliedFilters()
            ];
        case 'show':
            return [
                'success' => true,
                'data' => $data,
                'related' => $this->getRelatedData($data['id'])
            ];
        default:
            return parent::formatResponse($data, $type);
    }
}
```

## Hook Execution Order

Thứ tự thực thi các hooks:

1. **Before Action**: `beforeAction()`
2. **Request Parsing**: Parse query parameters
3. **Query Building**: `modifyIndex()`, `modifyShow()`, `modify()`
4. **Data Processing**: `storing()`, `updating()`, `destroying()`
5. **Response Building**: `modifyResponse()`, `modifyIndexResponse()`, `modifyShowResponse()`
6. **After Action**: `afterAction()`

## Best Practices

### 1. Hook Naming Convention
- Sử dụng tên rõ ràng và mô tả
- Tuân thủ quy ước đặt tên của Laravel
- Sử dụng prefix `modify` cho query hooks
- Sử dụng suffix `ing` cho data hooks

### 2. Hook Performance
- Tránh thực hiện các operation nặng trong hooks
- Sử dụng eager loading để tránh N+1 queries
- Cache kết quả của các hook phức tạp

### 3. Hook Security
- Luôn validate input data
- Kiểm tra quyền truy cập
- Sử dụng policies thay vì logic trong hooks
- Escape output để tránh XSS

### 4. Hook Testing
- Viết unit test cho từng hook
- Test các trường hợp edge case
- Mock external dependencies
- Test performance impact

## Examples

### User Management Controller

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    protected function modifyIndex($query)
    {
        // Chỉ hiển thị users mà current user có quyền xem
        if (!auth()->user()->hasRole('admin')) {
            $query->where('department_id', auth()->user()->department_id);
        }
        
        return $query;
    }
    
    protected function storing($data)
    {
        // Tự động gán department
        $data['department_id'] = auth()->user()->department_id;
        
        // Hash password
        $data['password'] = Hash::make($data['password']);
        
        return $data;
    }
    
    protected function updating($data, $user)
    {
        // Kiểm tra quyền cập nhật
        if (!$this->canUpdateUser($user)) {
            throw new UnauthorizedException('Không có quyền cập nhật user này');
        }
        
        // Hash password nếu có thay đổi
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        return $data;
    }
    
    protected function destroying($user)
    {
        // Soft delete thay vì hard delete
        $user->update(['deleted_at' => now()]);
        return false; // Ngăn không cho xóa thật
    }
    
    private function canUpdateUser($user)
    {
        return auth()->user()->hasRole('admin') || 
               auth()->id() === $user->id;
    }
}
```

### Product Controller với Business Logic

```php
class ProductController extends ApiController
{
    protected $model = Product::class;
    
    protected function modifyIndex($query)
    {
        // Lọc theo category nếu có
        if (request()->has('category_id')) {
            $query->where('category_id', request('category_id'));
        }
        
        // Chỉ hiển thị sản phẩm có sẵn
        $query->where('stock_quantity', '>', 0);
        
        return $query;
    }
    
    protected function storing($data)
    {
        // Tự động tạo SKU
        $data['sku'] = $this->generateSKU($data['name']);
        
        // Set giá mặc định
        if (!isset($data['price'])) {
            $data['price'] = 0;
        }
        
        return $data;
    }
    
    protected function updating($data, $product)
    {
        // Cập nhật SKU nếu tên thay đổi
        if (isset($data['name']) && $data['name'] !== $product->name) {
            $data['sku'] = $this->generateSKU($data['name']);
        }
        
        // Log thay đổi giá
        if (isset($data['price']) && $data['price'] !== $product->price) {
            Log::info('Product price changed', [
                'product_id' => $product->id,
                'old_price' => $product->price,
                'new_price' => $data['price'],
                'changed_by' => auth()->id()
            ]);
        }
        
        return $data;
    }
    
    private function generateSKU($name)
    {
        $prefix = strtoupper(substr($name, 0, 3));
        $suffix = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        return $prefix . $suffix;
    }
}
```

## Kết luận

Hệ thống hooks của `froiden/laravel-rest-api` cung cấp sự linh hoạt cao để tùy biến hành vi API mà không cần ghi đè các phương thức cốt lõi. Bằng cách sử dụng các hooks một cách hợp lý, bạn có thể:

- Thêm business logic vào các điểm cụ thể
- Tùy chỉnh query và response
- Implement security và authorization
- Thêm logging và monitoring
- Tối ưu hóa performance

Hãy sử dụng các hooks một cách có hệ thống và tuân thủ best practices để đảm bảo code dễ maintain và mở rộng.
