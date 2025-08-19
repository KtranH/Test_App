# Request Parsing - Hướng dẫn chi tiết

## 🎯 Tổng quan

`RequestParser` là thành phần cốt lõi của thư viện, chịu trách nhiệm phân tích và xử lý tất cả query parameters từ client request. Parser này chuyển đổi các parameters thành Eloquent Query Builder operations, cho phép client tùy chỉnh response một cách linh hoạt.

## 🔍 Query Parameters được hỗ trợ

### 1. Fields Parameter

```http
GET /api/users?fields=id,name,email,profile{avatar,bio}
```

**Cú pháp:**
- **Basic fields**: `id,name,email,created_at`
- **Nested relations**: `profile{avatar,bio}`
- **Nested with limits**: `posts{id,title}.limit(5)`
- **Nested with offset**: `posts{id,title}.offset(10)`
- **Nested with ordering**: `posts{id,title}.order(created_at desc)`

**Ví dụ thực tế:**
```http
# Lấy users với profile và posts
GET /api/users?fields=id,name,email,profile{avatar,bio},posts{id,title,created_at}.limit(3)

# Lấy users với nested relations
GET /api/users?fields=id,name,roles{id,name,permissions{id,name}}
```

### 2. Filters Parameter

```http
GET /api/users?filters=(is_active eq true) and (created_at gt "2024-01-01")
```

**Operators hỗ trợ:**
- `eq` - Equal to
- `ne` - Not equal to
- `gt` - Greater than
- `ge` - Greater than or equal to
- `lt` - Less than
- `le` - Less than or equal to
- `lk` - Like (contains)

**Logic operators:**
- `and` - Logical AND
- `or` - Logical OR
- `()` - Grouping parentheses

**Ví dụ thực tế:**
```http
# Filter đơn giản
GET /api/users?filters=(is_active eq true)

# Filter phức tạp
GET /api/users?filters=(role_id eq 1) and ((created_at gt "2024-01-01") or (email lk "@gmail.com"))

# Filter với null values
GET /api/users?filters=(deleted_at eq null)

# Filter với multiple values
GET /api/users?filters=(role_id eq 1,2,3)
```

### 3. Order Parameter

```http
GET /api/users?order=name asc,created_at desc
```

**Cú pháp:**
- **Single field**: `name asc`
- **Multiple fields**: `name asc,created_at desc,email asc`
- **Default direction**: Nếu không chỉ định, mặc định là `asc`

**Ví dụ thực tế:**
```http
# Sắp xếp đơn giản
GET /api/users?order=name asc

# Sắp xếp nhiều fields
GET /api/users?order=is_active desc,name asc,created_at desc

# Sắp xếp với relation fields
GET /api/users?order=profile.name asc
```

### 4. Pagination Parameters

```http
GET /api/users?limit=20&offset=40
```

**Parameters:**
- `limit` - Số bản ghi mỗi trang (default: 10, max: 1000)
- `offset` - Vị trí bắt đầu (zero-based)

**Ví dụ thực tế:**
```http
# Trang đầu tiên
GET /api/users?limit=20&offset=0

# Trang thứ 3
GET /api/users?limit=20&offset=40

# Pagination với filters
GET /api/users?filters=(is_active eq true)&limit=15&offset=30
```

### 5. Includes Parameter

```http
GET /api/users?includes=profile,posts,roles
```

**Cú pháp:**
- **Basic includes**: `profile,posts,roles`
- **Nested includes**: `profile,posts.comments,roles.permissions`
- **Includes với field selection**: `profile{avatar,bio},posts{id,title}`

**Ví dụ thực tế:**
```http
# Include relations cơ bản
GET /api/users?includes=profile,posts

# Include nested relations
GET /api/users?includes=profile,posts.comments.author,roles.permissions

# Include với field selection
GET /api/users?includes=profile{avatar,bio},posts{id,title,created_at}
```

## 🔧 Cách hoạt động của RequestParser

### 1. Parsing Flow

```
Request → Parse Fields → Parse Filters → Parse Order → Parse Pagination → Build Query
```

### 2. Field Parsing

```php
// Request: ?fields=id,name,email,profile{avatar,bio}
$fields = [
    'id' => [],
    'name' => [],
    'email' => [],
    'profile' => [
        'fields' => ['avatar', 'bio'],
        'limit' => null,
        'offset' => null,
        'order' => null
    ]
];
```

### 3. Filter Parsing

```php
// Request: ?filters=(is_active eq true) and (created_at gt "2024-01-01")
$filters = [
    'type' => 'and',
    'conditions' => [
        [
            'field' => 'is_active',
            'operator' => 'eq',
            'value' => true
        ],
        [
            'field' => 'created_at',
            'operator' => 'gt',
            'value' => '2024-01-01'
        ]
    ]
];
```

### 4. Query Building

```php
// Từ parsed parameters, build Eloquent query
$query = User::query();

// Apply fields
$query->select(['id', 'name', 'email']);

// Apply filters
$query->where('is_active', true)
      ->where('created_at', '>', '2024-01-01');

// Apply ordering
$query->orderBy('name', 'asc')
      ->orderBy('created_at', 'desc');

// Apply pagination
$query->limit(20)->offset(40);

// Apply includes
$query->with(['profile' => function($q) {
    $q->select(['id', 'avatar', 'bio']);
}]);
```

## 🎮 Tùy biến RequestParser

### 1. Custom Field Parsing

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Tùy biến field parsing
     */
    protected function parseRequest()
    {
        parent::parseRequest();
        
        // Thêm computed fields
        if (request('fields') && str_contains(request('fields'), 'full_name')) {
            $this->parser->addComputedField('full_name');
        }
        
        return $this;
    }
}
```

### 2. Custom Filter Handling

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Tùy biến filter parsing
     */
    protected function addFilters()
    {
        // Custom filter: search
        if (request('search')) {
            $searchTerm = request('search');
            $this->query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }
        
        // Custom filter: date range
        if (request('date_from') && request('date_to')) {
            $this->query->whereBetween('created_at', [
                request('date_from'),
                request('date_to')
            ]);
        }
        
        return parent::addFilters();
    }
}
```

### 3. Custom Ordering

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Tùy biến ordering
     */
    protected function addOrdering()
    {
        // Custom ordering: relevance score
        if (request('order') === 'relevance') {
            $this->query->orderBy('relevance_score', 'desc');
            return $this;
        }
        
        // Custom ordering: random
        if (request('order') === 'random') {
            $this->query->inRandomOrder();
            return $this;
        }
        
        return parent::addOrdering();
    }
}
```

## 🛡️ Security và Validation

### 1. Field Security

```php
class User extends ApiModel
{
    /**
     * Chỉ những fields này mới được phép select
     */
    protected $default = ['id', 'name', 'email', 'is_active'];
    
    /**
     * Fields luôn bị ẩn
     */
    protected $hidden = ['password', 'remember_token'];
    
    /**
     * Fields có thể filter
     */
    protected $filterable = ['id', 'name', 'email', 'role_id', 'is_active'];
}
```

### 2. Filter Validation

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Validate filters trước khi áp dụng
     */
    protected function addFilters()
    {
        $filters = request('filters');
        
        if ($filters) {
            // Validate filter syntax
            if (!$this->validateFilterSyntax($filters)) {
                throw new InvalidFilterException('Invalid filter syntax');
            }
            
            // Validate filter fields
            $this->validateFilterFields($filters);
        }
        
        return parent::addFilters();
    }
    
    private function validateFilterSyntax($filters)
    {
        // Implement filter syntax validation
        return preg_match('/^[a-zA-Z0-9\s\(\)\.,"\'<>=!&|]+$/', $filters);
    }
    
    private function validateFilterFields($filters)
    {
        // Extract field names from filters
        preg_match_all('/([a-zA-Z_][a-zA-Z0-9_]*)\.?[a-zA-Z0-9_]*\s+(eq|ne|gt|ge|lt|le|lk)/', $filters, $matches);
        
        $fields = $matches[1] ?? [];
        
        foreach ($fields as $field) {
            if (!in_array($field, $this->model::getFilterableFields())) {
                throw new InvalidFilterException("Field '{$field}' is not filterable");
            }
        }
    }
}
```

### 3. Rate Limiting

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Rate limiting cho complex queries
     */
    protected function addFilters()
    {
        // Check rate limit for complex filters
        if (strlen(request('filters', '')) > 100) {
            $this->checkRateLimit('complex_filters', 10, 1); // 10 requests per minute
        }
        
        return parent::addFilters();
    }
    
    private function checkRateLimit($key, $maxAttempts, $decayMinutes)
    {
        $key = "rate_limit:{$key}:" . request()->ip();
        
        if (Cache::has($key)) {
            $attempts = Cache::get($key);
            if ($attempts >= $maxAttempts) {
                throw new TooManyRequestsException('Rate limit exceeded');
            }
            Cache::increment($key);
        } else {
            Cache::put($key, 1, $decayMinutes * 60);
        }
    }
}
```

## 📊 Performance Optimization

### 1. Query Optimization

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Optimize queries cho performance
     */
    protected function addIncludes()
    {
        // Chỉ include relations khi cần thiết
        if (request('fields') && str_contains(request('fields'), 'profile')) {
            $this->query->with(['profile' => function($q) {
                $q->select(['id', 'user_id', 'avatar', 'bio']);
            }]);
        }
        
        if (request('fields') && str_contains(request('fields'), 'posts')) {
            $this->query->with(['posts' => function($q) {
                $q->select(['id', 'user_id', 'title', 'content'])
                  ->orderBy('created_at', 'desc')
                  ->limit(5);
            }]);
        }
        
        return $this;
    }
}
```

### 2. Caching

```php
class UserController extends ApiController
{
    protected $model = User::class;
    
    /**
     * Cache expensive queries
     */
    protected function getResults($single = false)
    {
        $cacheKey = $this->generateCacheKey();
        
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        $results = parent::getResults($single);
        
        // Cache results for 5 minutes
        Cache::put($cacheKey, $results, 300);
        
        return $results;
    }
    
    private function generateCacheKey()
    {
        $params = [
            'fields' => request('fields'),
            'filters' => request('filters'),
            'order' => request('order'),
            'limit' => request('limit'),
            'offset' => request('offset')
        ];
        
        return 'api_query:' . md5(serialize($params));
    }
}
```

## 🚨 Common Issues và Solutions

### 1. Invalid Filter Syntax

```http
# ❌ Sai: Syntax không hợp lệ
GET /api/users?filters=is_active = true

# ✅ Đúng: Syntax hợp lệ
GET /api/users?filters=(is_active eq true)
```

### 2. Field Not Found

```http
# ❌ Sai: Field không tồn tại
GET /api/users?fields=id,name,invalid_field

# ✅ Đúng: Chỉ sử dụng fields có sẵn
GET /api/users?fields=id,name,email
```

### 3. Complex Nested Relations

```http
# ❌ Sai: Nested quá sâu
GET /api/users?fields=id,name,posts.comments.author.profile.avatar

# ✅ Đúng: Giới hạn depth
GET /api/users?fields=id,name,posts{id,title,comments{id,content}}
```

## 📚 Best Practices

### 1. Field Selection
- **Minimal Default**: Chỉ include fields cần thiết mặc định
- **Client Control**: Cho phép client override qua fields parameter
- **Security**: Luôn ẩn sensitive fields

### 2. Filtering
- **Whitelist Approach**: Chỉ cho phép filter trên fields cụ thể
- **Validation**: Validate filter syntax và field names
- **Performance**: Index filterable fields

### 3. Relations
- **Eager Loading**: Sử dụng includes để tránh N+1 queries
- **Depth Control**: Giới hạn depth của nested relations
- **Field Selection**: Chỉ select fields cần thiết của relations

### 4. Performance
- **Query Optimization**: Tối ưu queries với proper indexing
- **Caching**: Cache expensive queries
- **Rate Limiting**: Giới hạn rate cho complex queries

---

🎯 **Tóm tắt**: `RequestParser` cung cấp một hệ thống mạnh mẽ và linh hoạt để xử lý query parameters từ client. Sử dụng các features này để tạo ra API responses tùy chỉnh, an toàn và hiệu quả.
