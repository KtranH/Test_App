# Tính năng Nâng cao

## Tổng quan

Thư viện `froiden/laravel-rest-api` cung cấp nhiều tính năng nâng cao để xây dựng API phức tạp và mạnh mẽ.

## 1. API Versioning

### Cấu hình Versioning
```php
// config/api.php
'default_version' => 'v1',
'versions' => ['v1', 'v2', 'v3'],

// routes/api.php
ApiRoute::version('v1')->group(function () {
    ApiRoute::get('users', [UserController::class, 'index']);
});

ApiRoute::version('v2')->group(function () {
    ApiRoute::get('users', [UserV2Controller::class, 'index']);
});
```

### Version-specific Controllers
```php
class UserV2Controller extends ApiController
{
    protected $model = User::class;
    
    // V2 có thêm fields mới
    protected function modifyIndex($query)
    {
        return $query->with(['profile', 'preferences']);
    }
}
```

## 2. Advanced Query Building

### Custom Query Scopes
```php
class User extends ApiModel
{
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
    
    public function scopeWithRole($query, $role)
    {
        return $query->whereHas('roles', function ($q) use ($role) {
            $q->where('name', $role);
        });
    }
}

// Sử dụng trong controller
protected function modifyIndex($query)
{
    return $query->active()->withRole('admin');
}
```

### Dynamic Query Building
```php
protected function buildDynamicQuery($query)
{
    $filters = request()->all();
    
    foreach ($filters as $field => $value) {
        if (in_array($field, $this->filterable)) {
            if (is_array($value)) {
                $query->whereIn($field, $value);
            } else {
                $query->where($field, $value);
            }
        }
    }
    
    return $query;
}
```

## 3. Advanced Response Handling

### Custom Response Transformers
```php
class UserTransformer
{
    public function transform($user)
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'profile' => [
                'avatar' => $user->profile->avatar_url,
                'bio' => $user->profile->bio
            ],
            'stats' => [
                'posts_count' => $user->posts()->count(),
                'followers_count' => $user->followers()->count()
            ]
        ];
    }
}

// Trong controller
protected function modifyResponse($response, $type)
{
    if ($type === 'show') {
        $transformer = new UserTransformer();
        $response['data'] = $transformer->transform($response['data']);
    }
    
    return $response;
}
```

### Conditional Response Fields
```php
protected function getResponseFields()
{
    $fields = ['id', 'name', 'email'];
    
    if (auth()->user()->hasRole('admin')) {
        $fields[] = 'created_at';
        $fields[] = 'updated_at';
    }
    
    return $fields;
}
```

## 4. Advanced Caching

### Query Result Caching
```php
protected function getCachedResults($query, $cacheKey)
{
    return Cache::remember($cacheKey, 3600, function () use ($query) {
        return $query->get();
    });
}

protected function modifyIndex($query)
{
    $cacheKey = 'users_' . md5(request()->fullUrl());
    return $this->getCachedResults($query, $cacheKey);
}
```

### Cache Invalidation
```php
protected function afterAction($action, $result)
{
    if (in_array($action, ['store', 'update', 'destroy'])) {
        Cache::tags(['users'])->flush();
    }
}
```

## 5. Advanced Validation

### Custom Validation Rules
```php
class CustomUserRequest extends FormRequest
{
    public function rules()
    {
        $userId = $this->route('id');
        
        return [
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($userId)
            ],
            'password' => [
                'required',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/'
            ]
        ];
    }
    
    public function messages()
    {
        return [
            'password.regex' => 'Password must contain uppercase, lowercase and number'
        ];
    }
}
```

### Conditional Validation
```php
protected function getValidationRules($action)
{
    $rules = [
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users'
    ];
    
    if ($action === 'store') {
        $rules['password'] = 'required|min:8|confirmed';
    }
    
    if (request()->has('phone')) {
        $rules['phone'] = 'required|regex:/^\+?[1-9]\d{1,14}$/';
    }
    
    return $rules;
}
```

## 6. Advanced Authorization

### Dynamic Policy Resolution
```php
protected function resolvePolicy($model)
{
    $policyClass = get_class($model) . 'Policy';
    
    if (class_exists($policyClass)) {
        return app($policyClass);
    }
    
    return null;
}

protected function checkPermission($action, $model)
{
    $policy = $this->resolvePolicy($model);
    
    if ($policy && method_exists($policy, $action)) {
        return Gate::forUser(auth()->user())->allows($action, $model);
    }
    
    return true;
}
```

### Role-based Field Access
```php
protected function getVisibleFields()
{
    $fields = ['id', 'name', 'email'];
    
    if (auth()->user()->hasRole('admin')) {
        $fields = array_merge($fields, ['created_at', 'updated_at', 'deleted_at']);
    }
    
    if (auth()->user()->hasRole('manager')) {
        $fields[] = 'department_id';
    }
    
    return $fields;
}
```

## 7. Advanced Middleware

### Custom API Middleware
```php
class ApiRateLimitMiddleware
{
    public function handle($request, Closure $next)
    {
        $key = 'api_rate_limit_' . auth()->id();
        $limit = 100; // requests per hour
        
        if (Cache::has($key) && Cache::get($key) >= $limit) {
            return response()->json([
                'error' => 'Rate limit exceeded',
                'retry_after' => Cache::get($key . '_reset')
            ], 429);
        }
        
        Cache::increment($key);
        
        return $next($request);
    }
}
```

### Middleware Groups
```php
// routes/api.php
ApiRoute::middleware(['auth:sanctum', 'api.rate.limit'])->group(function () {
    ApiRoute::get('users', [UserController::class, 'index']);
});
```

## 8. Advanced Error Handling

### Custom Error Responses
```php
protected function handleValidationError($validator)
{
    $errors = $validator->errors();
    $customErrors = [];
    
    foreach ($errors->toArray() as $field => $messages) {
        $customErrors[$field] = [
            'messages' => $messages,
            'field_type' => $this->getFieldType($field),
            'suggestions' => $this->getFieldSuggestions($field)
        ];
    }
    
    throw new ValidationException($customErrors);
}
```

### Error Recovery
```php
protected function handleDatabaseError($exception)
{
    if ($exception instanceof QueryException) {
        Log::error('Database error', [
            'sql' => $exception->getSql(),
            'bindings' => $exception->getBindings()
        ]);
        
        // Retry logic
        if ($this->shouldRetry($exception)) {
            return $this->retryOperation();
        }
    }
    
    throw $exception;
}
```

## 9. Advanced Logging

### Structured API Logging
```php
protected function logApiRequest($action, $data = [])
{
    $logData = [
        'action' => $action,
        'user_id' => auth()->id(),
        'ip_address' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'request_data' => $data,
        'timestamp' => now()->toISOString()
    ];
    
    Log::channel('api')->info('API Request', $logData);
}
```

### Performance Monitoring
```php
protected function measurePerformance($callback)
{
    $startTime = microtime(true);
    $startMemory = memory_get_usage();
    
    $result = $callback();
    
    $endTime = microtime(true);
    $endMemory = memory_get_usage();
    
    $this->logPerformance([
        'duration' => ($endTime - $startTime) * 1000,
        'memory_usage' => $endMemory - $startMemory
    ]);
    
    return $result;
}
```

## 10. Advanced Testing

### API Testing Helpers
```php
trait ApiTestingHelpers
{
    protected function assertApiResponse($response, $expectedStatus = 200)
    {
        $response->assertStatus($expectedStatus)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'meta'
                ]);
    }
    
    protected function assertApiError($response, $expectedStatus = 400)
    {
        $response->assertStatus($expectedStatus)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'error_code'
                ])
                ->assertJson(['success' => false]);
    }
}
```

### Mock External Services
```php
protected function mockExternalService($service, $response)
{
    Http::fake([
        $service . '/*' => Http::response($response, 200)
    ]);
}
```

## Kết luận

Các tính năng nâng cao này cho phép bạn xây dựng API enterprise-grade với:

- **Scalability**: Versioning và caching
- **Security**: Advanced authorization và validation
- **Performance**: Query optimization và monitoring
- **Maintainability**: Structured logging và testing
- **Flexibility**: Custom transformers và middleware

Sử dụng các tính năng này một cách hợp lý để tạo ra API mạnh mẽ và dễ maintain.
