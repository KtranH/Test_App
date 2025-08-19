# Hướng dẫn Migration

## Tổng quan

Hướng dẫn chuyển đổi từ Laravel API thông thường sang sử dụng `froiden/laravel-rest-api`.

## 1. Chuẩn bị Migration

### Backup Project
```bash
# Backup toàn bộ project
cp -r /path/to/project /path/to/backup

# Backup database
php artisan db:backup

# Backup routes
cp routes/api.php routes/api.php.backup
```

### Cài đặt Package
```bash
composer require froiden/laravel-rest-api

# Publish config
php artisan vendor:publish --provider="Froiden\RestAPI\Providers\ApiServiceProvider"
```

## 2. Migration Controllers

### Từ Controller Thông thường
```php
// Trước: Controller cũ
class UserController extends Controller
{
    public function index()
    {
        $users = User::paginate(20);
        return response()->json($users);
    }
    
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users'
        ]);
        
        $user = User::create($validated);
        return response()->json($user, 201);
    }
}

// Sau: Sử dụng ApiController
class UserController extends ApiController
{
    protected $model = User::class;
    protected $defaultLimit = 20;
    
    // Tự động có các methods: index, show, store, update, destroy
}
```

### Migration với Custom Logic
```php
// Trước: Controller với business logic
class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();
        
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $products = $query->paginate(20);
        return response()->json($products);
    }
}

// Sau: Sử dụng hooks
class ProductController extends ApiController
{
    protected $model = Product::class;
    
    protected function modifyIndex($query)
    {
        if (request()->has('category')) {
            $query->where('category_id', request('category'));
        }
        
        if (request()->has('status')) {
            $query->where('status', request('status'));
        }
        
        return $query;
    }
}
```

## 3. Migration Models

### Từ Eloquent Model Thông thường
```php
// Trước: Model cũ
class User extends Model
{
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password'];
    
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}

// Sau: Extend ApiModel
class User extends ApiModel
{
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password'];
    
    // Thêm properties cho API
    protected $default = ['id', 'name', 'email', 'status'];
    protected $filterable = ['name', 'email', 'status', 'created_at'];
    protected $relationKeys = ['profile', 'roles'];
    
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
```

### Migration với Relationships
```php
// Trước: Model với relationships
class Post extends Model
{
    public function author()
    {
        return $this->belongsTo(User::class);
    }
    
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}

// Sau: Thêm relationKeys
class Post extends ApiModel
{
    protected $relationKeys = ['author', 'comments'];
    
    public function author()
    {
        return $this->belongsTo(User::class);
    }
    
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

## 4. Migration Routes

### Từ Routes Thông thường
```php
// Trước: routes/api.php cũ
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});

// Sau: Sử dụng ApiRoute
ApiRoute::middleware(['auth:sanctum'])->group(function () {
    ApiRoute::apiResource('users', UserController::class);
});
```

### Migration với Custom Routes
```php
// Trước: Routes với custom logic
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users/active', [UserController::class, 'activeUsers']);
    Route::get('/users/{id}/posts', [UserController::class, 'userPosts']);
    Route::post('/users/{id}/activate', [UserController::class, 'activate']);
});

// Sau: Sử dụng ApiRoute với custom methods
ApiRoute::middleware(['auth:sanctum'])->group(function () {
    ApiRoute::apiResource('users', UserController::class);
    
    // Custom routes
    ApiRoute::get('users/active', [UserController::class, 'activeUsers']);
    ApiRoute::get('users/{id}/posts', [UserController::class, 'userPosts']);
    ApiRoute::post('users/{id}/activate', [UserController::class, 'activate']);
});
```

## 5. Migration Validation

### Từ Request Validation Thông thường
```php
// Trước: Validation trong controller
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8'
    ]);
    
    $user = User::create($validated);
    return response()->json($user, 201);
}

// Sau: Sử dụng Form Request
class UserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8'
        ];
    }
}

class UserController extends ApiController
{
    protected $model = User::class;
    protected $formRequest = UserRequest::class;
}
```

### Migration với Custom Validation
```php
// Trước: Custom validation logic
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email|unique:users'
    ]);
    
    if ($validator->fails()) {
        return response()->json([
            'errors' => $validator->errors()
        ], 422);
    }
    
    // Custom business logic validation
    if ($request->email && $this->isBlockedDomain($request->email)) {
        return response()->json([
            'error' => 'Email domain is blocked'
        ], 422);
    }
    
    $user = User::create($request->all());
    return response()->json($user, 201);
}

// Sau: Sử dụng hooks
class UserController extends ApiController
{
    protected $model = User::class;
    protected $formRequest = UserRequest::class;
    
    protected function storing($data)
    {
        if (isset($data['email']) && $this->isBlockedDomain($data['email'])) {
            throw new ValidationException('Email domain is blocked');
        }
        
        return $data;
    }
}
```

## 6. Migration Response Handling

### Từ Custom Response Format
```php
// Trước: Custom response format
public function index()
{
    $users = User::paginate(20);
    
    return response()->json([
        'success' => true,
        'data' => $users->items(),
        'pagination' => [
            'current_page' => $users->currentPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
            'last_page' => $users->lastPage()
        ]
    ]);
}

// Sau: Tự động format response
class UserController extends ApiController
{
    protected $model = User::class;
    
    // Response tự động được format theo chuẩn
    // Có thể tùy chỉnh bằng hooks
    protected function modifyIndexResponse($response)
    {
        // Tùy chỉnh response nếu cần
        return $response;
    }
}
```

### Migration với Custom Response
```php
// Trước: Custom response với metadata
public function show($id)
{
    $user = User::findOrFail($id);
    
    return response()->json([
        'success' => true,
        'data' => $user,
        'meta' => [
            'last_login' => $user->last_login_at,
            'total_posts' => $user->posts()->count(),
            'is_online' => $user->isOnline()
        ]
    ]);
}

// Sau: Sử dụng hooks
class UserController extends ApiController
{
    protected $model = User::class;
    
    protected function modifyShowResponse($response)
    {
        $user = $response['data'];
        
        $response['meta'] = [
            'last_login' => $user->last_login_at,
            'total_posts' => $user->posts()->count(),
            'is_online' => $user->isOnline()
        ];
        
        return $response;
    }
}
```

## 7. Migration Exception Handling

### Từ Try-Catch Blocks
```php
// Trước: Manual exception handling
public function show($id)
{
    try {
        $user = User::findOrFail($id);
        
        if (!$this->canViewUser($user)) {
            return response()->json([
                'error' => 'Access denied'
            ], 403);
        }
        
        return response()->json($user);
        
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'error' => 'User not found'
        ], 404);
    } catch (Exception $e) {
        return response()->json([
            'error' => 'Internal server error'
        ], 500);
    }
}

// Sau: Sử dụng exceptions và policies
class UserController extends ApiController
{
    protected $model = User::class;
    
    protected function modifyShow($query)
    {
        $user = $query->first();
        
        if ($user) {
            $this->authorize('view', $user);
        }
        
        return $query;
    }
}
```

### Migration với Custom Exceptions
```php
// Trước: Custom error responses
public function store(Request $request)
{
    try {
        $user = User::create($request->all());
        
        if (!$user) {
            return response()->json([
                'error' => 'Failed to create user'
            ], 500);
        }
        
        return response()->json($user, 201);
        
    } catch (QueryException $e) {
        return response()->json([
            'error' => 'Database error occurred'
        ], 500);
    }
}

// Sau: Sử dụng custom exceptions
class UserController extends ApiController
{
    protected $model = User::class;
    
    protected function storing($data)
    {
        try {
            // Business logic validation
            $this->validateBusinessRules($data);
            
            return $data;
            
        } catch (BusinessRuleException $e) {
            throw new ValidationException($e->getMessage());
        }
    }
}
```

## 8. Migration Testing

### Từ Test Cũ
```php
// Trước: Test cũ
public function test_user_can_view_users()
{
    $user = User::factory()->create();
    
    $response = $this->actingAs($user)
                    ->get('/api/users');
    
    $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email']
                ]
            ]);
}

// Sau: Test với ApiTestCase
class UserControllerTest extends ApiTestCase
{
    public function test_user_can_view_users()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
                        ->getJson('/api/users');
        
        $this->assertApiSuccess($response);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'email']
            ]
        ]);
    }
}
```

## 9. Migration Checklist

### Trước khi Migration
- [ ] Backup toàn bộ project
- [ ] Backup database
- [ ] Cài đặt package
- [ ] Publish config files
- [ ] Review existing code structure

### Trong quá trình Migration
- [ ] Migrate controllers từ Controller sang ApiController
- [ ] Migrate models từ Model sang ApiModel
- [ ] Cập nhật routes sử dụng ApiRoute
- [ ] Chuyển validation logic sang Form Requests
- [ ] Implement hooks cho custom logic
- [ ] Cập nhật exception handling

### Sau khi Migration
- [ ] Test tất cả endpoints
- [ ] Verify response format
- [ ] Check error handling
- [ ] Update documentation
- [ ] Performance testing
- [ ] Security review

## 10. Common Migration Issues

### Issue 1: Middleware Conflicts
```php
// Vấn đề: Middleware được apply nhiều lần
class UserController extends ApiController
{
    public function __construct()
    {
        parent::__construct();
        $this->middleware('auth:sanctum'); // ❌ Không cần thiết
    }
}

// Giải pháp: Middleware đã được apply ở route level
ApiRoute::middleware(['auth:sanctum'])->group(function () {
    ApiRoute::apiResource('users', UserController::class);
});
```

### Issue 2: Response Format Mismatch
```php
// Vấn đề: Response format không khớp với frontend
// Giải pháp: Sử dụng hooks để tùy chỉnh response
protected function modifyResponse($response, $type)
{
    // Tùy chỉnh format theo yêu cầu frontend
    return $response;
}
```

### Issue 3: Validation Rules Conflict
```php
// Vấn đề: Validation rules không hoạt động
// Giải pháp: Đảm bảo Form Request được implement đúng
protected $formRequest = UserRequest::class;
```

## Kết luận

Migration sang `froiden/laravel-rest-api` sẽ giúp:

- **Giảm code duplication**: Tự động CRUD operations
- **Tăng consistency**: Response format chuẩn
- **Dễ maintain**: Hooks system linh hoạt
- **Performance**: Query optimization tự động
- **Security**: Built-in validation và authorization

Thực hiện migration từng bước và test kỹ lưỡng để đảm bảo không có breaking changes.
