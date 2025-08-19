# Best Practices và Examples

## Tổng quan

Hướng dẫn best practices để sử dụng `froiden/laravel-rest-api` một cách hiệu quả và maintainable.

## 1. Controller Structure

### Base Controller Pattern
```php
abstract class BaseApiController extends ApiController
{
    protected $defaultLimit = 20;
    protected $maxLimit = 100;
    
    protected function beforeAction($action)
    {
        $this->logAction($action);
        $this->checkPermissions($action);
    }
    
    protected function afterAction($action, $result)
    {
        $this->clearCache();
        $this->sendNotifications($action, $result);
    }
    
    abstract protected function getValidationRules($action);
    abstract protected function getFilterableFields();
}
```

### Specific Controller Implementation
```php
class UserController extends BaseApiController
{
    protected $model = User::class;
    protected $formRequest = UserRequest::class;
    
    protected function getValidationRules($action)
    {
        return [
            'store' => [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:8|confirmed'
            ],
            'update' => [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,' . $this->getItemId(),
                'password' => 'sometimes|min:8|confirmed'
            ]
        ][$action] ?? [];
    }
    
    protected function getFilterableFields()
    {
        return ['name', 'email', 'status', 'created_at'];
    }
}
```

## 2. Model Best Practices

### ApiModel Implementation
```php
class User extends ApiModel
{
    protected $fillable = [
        'name', 'email', 'password', 'status'
    ];
    
    protected $hidden = [
        'password', 'remember_token'
    ];
    
    protected $default = [
        'id', 'name', 'email', 'status', 'created_at'
    ];
    
    protected $filterable = [
        'name', 'email', 'status', 'created_at'
    ];
    
    protected $relationKeys = [
        'profile', 'roles', 'posts'
    ];
    
    // Accessors
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
    
    // Scopes
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
```

### Relationship Handling
```php
class Post extends ApiModel
{
    protected $relationKeys = [
        'author', 'comments', 'tags'
    ];
    
    public function author()
    {
        return $this->belongsTo(User::class);
    }
    
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
```

## 3. Request Validation

### Form Request Classes
```php
class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }
    
    public function rules()
    {
        $userId = $this->route('id');
        
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($userId)
            ],
            'password' => [
                'required',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/'
            ],
            'status' => 'sometimes|in:active,inactive,pending'
        ];
    }
    
    public function messages()
    {
        return [
            'password.regex' => 'Password must contain uppercase, lowercase and number',
            'status.in' => 'Status must be active, inactive, or pending'
        ];
    }
    
    protected function prepareForValidation()
    {
        $this->merge([
            'email' => strtolower($this->email),
            'name' => trim($this->name)
        ]);
    }
}
```

### Custom Validation Rules
```php
class CustomValidationRules
{
    public static function phone()
    {
        return 'regex:/^\+?[1-9]\d{1,14}$/';
    }
    
    public static function strongPassword()
    {
        return 'min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/';
    }
    
    public static function uniqueInCompany($table, $column, $companyId)
    {
        return Rule::unique($table, $column)->where('company_id', $companyId);
    }
}
```

## 4. Authorization Patterns

### Policy-based Authorization
```php
class UserPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasRole(['admin', 'manager']);
    }
    
    public function view(User $user, User $model)
    {
        return $user->id === $model->id || 
               $user->hasRole('admin') ||
               ($user->hasRole('manager') && $user->department_id === $model->department_id);
    }
    
    public function create(User $user)
    {
        return $user->hasRole('admin');
    }
    
    public function update(User $user, User $model)
    {
        return $this->view($user, $model);
    }
    
    public function delete(User $user, User $model)
    {
        return $user->hasRole('admin') && $user->id !== $model->id;
    }
}
```

### Role-based Access Control
```php
trait HasRoles
{
    public function hasRole($role)
    {
        if (is_array($role)) {
            return $this->roles()->whereIn('name', $role)->exists();
        }
        
        return $this->roles()->where('name', $role)->exists();
    }
    
    public function hasPermission($permission)
    {
        return $this->permissions()->where('name', $permission)->exists();
    }
    
    public function assignRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }
        
        $this->roles()->syncWithoutDetaching($role);
    }
}
```

## 5. Response Formatting

### Consistent Response Structure
```php
class ApiResponseFormatter
{
    public static function success($data, $message = 'Success', $statusCode = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toISOString(),
            'status_code' => $statusCode
        ], $statusCode);
    }
    
    public static function error($message, $statusCode = 400, $errors = null)
    {
        $response = [
            'success' => false,
            'message' => $message,
            'status_code' => $statusCode,
            'timestamp' => now()->toISOString()
        ];
        
        if ($errors) {
            $response['errors'] = $errors;
        }
        
        return response()->json($response, $statusCode);
    }
    
    public static function paginated($data, $pagination)
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'pagination' => $pagination,
            'timestamp' => now()->toISOString()
        ]);
    }
}
```

### Data Transformation
```php
class UserTransformer
{
    public function transform($user)
    {
        return [
            'id' => $user->id,
            'name' => $user->full_name,
            'email' => $user->email,
            'status' => $user->status,
            'profile' => [
                'avatar' => $user->profile->avatar_url ?? null,
                'bio' => $user->profile->bio ?? null
            ],
            'roles' => $user->roles->pluck('name'),
            'created_at' => $user->created_at->toISOString(),
            'updated_at' => $user->updated_at->toISOString()
        ];
    }
    
    public function transformCollection($users)
    {
        return $users->map(function ($user) {
            return $this->transform($user);
        });
    }
}
```

## 6. Error Handling

### Global Exception Handler
```php
class ApiExceptionHandler extends ExceptionHandler
{
    public function render($request, Throwable $e)
    {
        if ($request->expectsJson()) {
            if ($e instanceof ValidationException) {
                return $this->handleValidationException($e);
            }
            
            if ($e instanceof AuthenticationException) {
                return $this->handleAuthenticationException($e);
            }
            
            if ($e instanceof AuthorizationException) {
                return $this->handleAuthorizationException($e);
            }
            
            if ($e instanceof ModelNotFoundException) {
                return $this->handleModelNotFoundException($e);
            }
            
            return $this->handleGenericException($e);
        }
        
        return parent::render($request, $e);
    }
    
    protected function handleValidationException(ValidationException $e)
    {
        return ApiResponseFormatter::error(
            'Validation failed',
            422,
            $e->errors()
        );
    }
    
    protected function handleGenericException(Throwable $e)
    {
        Log::error('API Error', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);
        
        $message = config('app.debug') ? $e->getMessage() : 'Internal server error';
        
        return ApiResponseFormatter::error($message, 500);
    }
}
```

## 7. Caching Strategies

### Query Result Caching
```php
trait CacheableQueries
{
    protected function getCachedResults($query, $cacheKey, $ttl = 3600)
    {
        return Cache::remember($cacheKey, $ttl, function () use ($query) {
            return $query->get();
        });
    }
    
    protected function generateCacheKey($action, $filters = [])
    {
        $base = class_basename($this->model) . "_{$action}";
        $filtersHash = md5(serialize($filters));
        return "{$base}_{$filtersHash}";
    }
    
    protected function clearModelCache()
    {
        $modelName = class_basename($this->model);
        Cache::tags([$modelName])->flush();
    }
}
```

### Cache Implementation
```php
class UserController extends BaseApiController
{
    use CacheableQueries;
    
    protected function modifyIndex($query)
    {
        $filters = request()->only(['status', 'role', 'department']);
        $cacheKey = $this->generateCacheKey('index', $filters);
        
        return $this->getCachedResults($query, $cacheKey);
    }
    
    protected function afterAction($action, $result)
    {
        if (in_array($action, ['store', 'update', 'destroy'])) {
            $this->clearModelCache();
        }
    }
}
```

## 8. Testing Patterns

### API Test Base Class
```php
abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;
    
    protected $user;
    protected $admin;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->admin = User::factory()->create()->assignRole('admin');
    }
    
    protected function actingAsUser()
    {
        return $this->actingAs($this->user);
    }
    
    protected function actingAsAdmin()
    {
        return $this->actingAs($this->admin);
    }
    
    protected function assertApiSuccess($response, $expectedStatus = 200)
    {
        $response->assertStatus($expectedStatus)
                ->assertJson(['success' => true])
                ->assertJsonStructure(['success', 'data', 'timestamp']);
    }
    
    protected function assertApiError($response, $expectedStatus = 400)
    {
        $response->assertStatus($expectedStatus)
                ->assertJson(['success' => false])
                ->assertJsonStructure(['success', 'message', 'status_code']);
    }
}
```

### Controller Testing
```php
class UserControllerTest extends ApiTestCase
{
    public function test_index_returns_paginated_users()
    {
        User::factory()->count(15)->create();
        
        $response = $this->actingAsAdmin()
                        ->getJson('/api/users');
        
        $this->assertApiSuccess($response);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'email', 'status']
            ],
            'pagination' => ['current_page', 'per_page', 'total']
        ]);
    }
    
    public function test_store_creates_user_with_valid_data()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123'
        ];
        
        $response = $this->actingAsAdmin()
                        ->postJson('/api/users', $userData);
        
        $this->assertApiSuccess($response, 201);
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);
    }
    
    public function test_show_returns_user_details()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAsUser()
                        ->getJson("/api/users/{$user->id}");
        
        $this->assertApiSuccess($response);
        $response->assertJson([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ]
        ]);
    }
}
```

## 9. Performance Optimization

### Query Optimization
```php
class OptimizedUserController extends BaseApiController
{
    protected function modifyIndex($query)
    {
        return $query->with(['profile', 'roles'])
                    ->select(['id', 'name', 'email', 'status', 'created_at'])
                    ->orderBy('created_at', 'desc');
    }
    
    protected function modifyShow($query)
    {
        return $query->with([
            'profile',
            'roles',
            'posts' => function ($q) {
                $q->latest()->limit(5);
            }
        ]);
    }
    
    protected function getDefaultLimit()
    {
        return request('limit', 20);
    }
}
```

### Database Indexing
```php
// Migration
Schema::table('users', function (Blueprint $table) {
    $table->index(['status', 'created_at']);
    $table->index(['email']);
    $table->index(['department_id']);
});

// Model
class User extends ApiModel
{
    protected $filterable = [
        'status', 'created_at', 'email', 'department_id'
    ];
}
```

## 10. Security Best Practices

### Input Sanitization
```php
trait SanitizesInput
{
    protected function sanitizeInput($data)
    {
        return collect($data)->map(function ($value, $key) {
            if (is_string($value)) {
                return $this->sanitizeString($value);
            }
            
            if (is_array($value)) {
                return $this->sanitizeInput($value);
            }
            
            return $value;
        })->toArray();
    }
    
    protected function sanitizeString($value)
    {
        return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
    }
}
```

### Rate Limiting
```php
class RateLimitMiddleware
{
    public function handle($request, Closure $next)
    {
        $key = 'rate_limit_' . auth()->id();
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

## Kết luận

Áp dụng các best practices này sẽ giúp bạn:

- **Maintainability**: Code structure rõ ràng và dễ maintain
- **Security**: Bảo vệ API khỏi các threats phổ biến
- **Performance**: Tối ưu hóa queries và caching
- **Testing**: Dễ dàng test và debug
- **Scalability**: Code có thể mở rộng dễ dàng

Hãy áp dụng các practices này một cách nhất quán trong toàn bộ project.
