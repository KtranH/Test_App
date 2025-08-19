# ApiModel - Hướng dẫn chi tiết

## 🎯 Tổng quan

`ApiModel` là class cơ sở cho tất cả models trong thư viện, kế thừa từ Laravel's Eloquent Model và mở rộng với các tính năng API chuyên biệt. Model này cung cấp field visibility control, filtering rules, relation handling, và data transformation.

## 🚀 Khởi tạo Model

### Cấu trúc cơ bản

```php
<?php

namespace App\Models;

use Froiden\RestAPI\ApiModel;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends ApiModel
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'is_active'
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at'
    ];
    
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean'
    ];
    
    // API Configuration
    protected $default = ['id', 'name', 'email', 'is_active', 'created_at'];
    protected $filterable = ['id', 'name', 'email', 'role_id', 'is_active', 'created_at'];
    protected $relationKeys = ['role_id'];
}
```

### Properties cần thiết

| Property | Type | Mô tả | Bắt buộc |
|----------|------|--------|----------|
| `$default` | array | Fields được trả về mặc định | ❌ |
| `$hidden` | array | Fields luôn bị ẩn | ❌ |
| `$filterable` | array | Fields có thể filter | ❌ |
| `$relationKeys` | array | Foreign key fields | ❌ |
| `$appends` | array | Computed fields | ❌ |

## 🔍 Field Visibility Control

### 1. Default Fields

```php
class User extends ApiModel
{
    /**
     * Fields được trả về mặc định khi không có fields parameter
     */
    protected $default = [
        'id',
        'name', 
        'email',
        'is_active',
        'created_at'
    ];
}
```

**Lưu ý**: 
- Luôn bao gồm `id` field
- Chỉ include fields cần thiết cho client
- Có thể override qua `fields` parameter trong request

### 2. Hidden Fields

```php
class User extends ApiModel
{
    /**
     * Fields luôn bị ẩn, không thể override
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
        'pivot'  // Quan trọng cho relations
    ];
}
```

**Lưu ý**:
- `pivot` field luôn nên ẩn để tránh lộ thông tin quan hệ
- Sensitive data như passwords, tokens nên ẩn
- Timestamps có thể ẩn nếu không cần thiết

### 3. Appended Fields

```php
class User extends ApiModel
{
    /**
     * Computed fields được thêm vào response
     */
    protected $appends = [
        'full_name',
        'age',
        'is_verified'
    ];
    
    /**
     * Computed: full_name
     */
    public function getFullNameAttribute()
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }
    
    /**
     * Computed: age
     */
    public function getAgeAttribute()
    {
        return $this->birth_date ? now()->diffInYears($this->birth_date) : null;
    }
    
    /**
     * Computed: is_verified
     */
    public function getIsVerifiedAttribute()
    {
        return !is_null($this->email_verified_at);
    }
}
```

## 🔒 Filtering và Security

### 1. Filterable Fields

```php
class User extends ApiModel
{
    /**
     * Chỉ những fields này mới được phép filter
     * Bảo mật quan trọng để tránh SQL injection
     */
    protected $filterable = [
        'id',
        'name',
        'email',
        'role_id',
        'is_active',
        'created_at',
        'updated_at'
    ];
}
```

**Lưu ý bảo mật**:
- **KHÔNG BAO GIỜ** để `$filterable = ['*']`
- Chỉ include fields thực sự cần thiết cho filtering
- Sensitive fields như `password_hash` không nên filterable

### 2. Relation Keys

```php
class User extends ApiModel
{
    /**
     * Foreign key fields để xử lý relations
     */
    protected $relationKeys = [
        'role_id',
        'department_id',
        'manager_id'
    ];
    
    /**
     * Relations
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }
}
```

## 🔗 Relation Handling

### 1. Basic Relations

```php
class User extends ApiModel
{
    protected $default = ['id', 'name', 'email', 'role'];
    
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
    
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}
```

### 2. Nested Relations

```php
class User extends ApiModel
{
    protected $default = ['id', 'name', 'email', 'profile{avatar,bio}'];
    
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
}

class Profile extends ApiModel
{
    protected $default = ['id', 'avatar', 'bio', 'user_id'];
    protected $hidden = ['user_id'];
}
```

### 3. Relation Field Selection

```php
class User extends ApiModel
{
    protected $default = [
        'id', 
        'name', 
        'email',
        'profile{id,avatar,bio}',
        'roles{id,name,permissions{id,name}}'
    ];
}
```

## 📊 Data Transformation

### 1. Date Formatting

```php
class User extends ApiModel
{
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime'
    ];
    
    /**
     * Custom date serialization format
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
    
    /**
     * Custom date parsing
     */
    protected function asDateTime($value)
    {
        if (is_numeric($value)) {
            return Carbon::createFromTimestamp($value);
        }
        
        return parent::asDateTime($value);
    }
}
```

### 2. Custom Accessors

```php
class User extends ApiModel
{
    protected $appends = ['display_name', 'status_label'];
    
    /**
     * Computed: display_name
     */
    public function getDisplayNameAttribute()
    {
        if ($this->nickname) {
            return $this->nickname;
        }
        
        return $this->first_name . ' ' . $this->last_name;
    }
    
    /**
     * Computed: status_label
     */
    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'active' => 'Hoạt động',
            'inactive' => 'Không hoạt động',
            'suspended' => 'Bị đình chỉ',
            default => 'Không xác định'
        };
    }
}
```

### 3. Custom Mutators

```php
class User extends ApiModel
{
    /**
     * Hash password trước khi lưu
     */
    public function setPasswordAttribute($value)
    {
        if ($value) {
            $this->attributes['password'] = Hash::make($value);
        }
    }
    
    /**
     * Format email trước khi lưu
     */
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = strtolower(trim($value));
    }
    
    /**
     * Format name trước khi lưu
     */
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = ucwords(strtolower(trim($value)));
    }
}
```

## 🛡️ Security Features

### 1. Field Protection

```php
class User extends ApiModel
{
    /**
     * Fields không bao giờ được expose
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'pivot'
    ];
    
    /**
     * Fields không được fill từ request
     */
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'email_verified_at'
    ];
}
```

### 2. Input Sanitization

```php
class User extends ApiModel
{
    /**
     * Sanitize input trước khi lưu
     */
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = filter_var(
            strtolower(trim($value)), 
            FILTER_SANITIZE_EMAIL
        );
    }
    
    /**
     * Sanitize HTML input
     */
    public function setBioAttribute($value)
    {
        $this->attributes['bio'] = strip_tags($value);
    }
}
```

## 🔧 Advanced Configuration

### 1. Custom Scopes

```php
class User extends ApiModel
{
    /**
     * Global scope: chỉ lấy active users
     */
    protected static function booted()
    {
        static::addGlobalScope('active', function ($query) {
            $query->where('is_active', true);
        });
    }
    
    /**
     * Local scope: users theo role
     */
    public function scopeByRole($query, $role)
    {
        return $query->whereHas('roles', function ($q) use ($role) {
            $q->where('name', $role);
        });
    }
    
    /**
     * Local scope: users theo department
     */
    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }
}
```

### 2. Custom Queries

```php
class User extends ApiModel
{
    /**
     * Custom query method
     */
    public static function search($term)
    {
        return static::where(function ($query) use ($term) {
            $query->where('name', 'like', "%{$term}%")
                  ->orWhere('email', 'like', "%{$term}%");
        });
    }
    
    /**
     * Get users with specific permissions
     */
    public static function withPermission($permission)
    {
        return static::whereHas('roles.permissions', function ($query) use ($permission) {
            $query->where('name', $permission);
        });
    }
}
```

### 3. Event Handling

```php
class User extends ApiModel
{
    /**
     * Events
     */
    protected static function booted()
    {
        // Trước khi tạo
        static::creating(function ($user) {
            $user->uuid = Str::uuid();
        });
        
        // Sau khi tạo
        static::created(function ($user) {
            event(new UserCreated($user));
        });
        
        // Trước khi cập nhật
        static::updating(function ($user) {
            $user->updated_by = auth()->id();
        });
        
        // Sau khi cập nhật
        static::updated(function ($user) {
            event(new UserUpdated($user));
        });
        
        // Trước khi xóa
        static::deleting(function ($user) {
            // Soft delete logic
            $user->deleted_by = auth()->id();
            $user->deleted_at = now();
            $user->save();
            
            return false; // Prevent actual deletion
        });
    }
}
```

## 📚 Best Practices

### 1. Field Selection
- **Minimal Default**: Chỉ include fields thực sự cần thiết
- **Security First**: Luôn ẩn sensitive fields
- **Performance**: Tránh include quá nhiều fields mặc định

### 2. Filtering
- **Whitelist Approach**: Chỉ cho phép filter trên fields cụ thể
- **Validation**: Validate filter values khi cần thiết
- **Indexing**: Đảm bảo filterable fields có database indexes

### 3. Relations
- **Eager Loading**: Sử dụng `with()` để tránh N+1 queries
- **Field Selection**: Chỉ select fields cần thiết của relations
- **Depth Control**: Tránh nested relations quá sâu

### 4. Performance
- **Database Indexes**: Index trên filterable và orderable fields
- **Query Optimization**: Sử dụng database views cho complex queries
- **Caching**: Cache expensive computed fields

### 5. Security
- **Input Validation**: Validate tất cả input trước khi lưu
- **Field Protection**: Không expose sensitive fields
- **Access Control**: Implement proper authorization logic

## 🚨 Common Pitfalls

### 1. Over-exposing Fields
```php
// ❌ KHÔNG NÊN
protected $default = ['*'];

// ✅ NÊN LÀM
protected $default = ['id', 'name', 'email', 'is_active'];
```

### 2. Insecure Filtering
```php
// ❌ KHÔNG AN TOÀN
protected $filterable = ['*'];

// ✅ AN TOÀN
protected $filterable = ['id', 'name', 'email', 'status'];
```

### 3. Missing Relations
```php
// ❌ THIẾU RELATION
protected $default = ['id', 'name', 'role_name'];

// ✅ CÓ RELATION
protected $default = ['id', 'name', 'role{id,name}'];
```

---

🎯 **Tóm tắt**: `ApiModel` cung cấp một foundation mạnh mẽ để xây dựng secure và performant API models với field visibility control, filtering rules, và data transformation capabilities. Sử dụng các features này để tạo ra API responses an toàn và hiệu quả.
