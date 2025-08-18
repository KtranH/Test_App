<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Froiden\RestAPI\ApiModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;

class User extends ApiModel implements AuthenticatableContract
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'google2fa_secret',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'google2fa_secret',
        'remember_token',
    ];

    //----------------------------------
    // Cấu hình cho Froiden Rest API
    //----------------------------------
    protected $filterable = [
        'id',
        'name',
        'email',
        'status',
        'role',
        'created_at',
        'updated_at',
    ];

    protected $default = [
        'id',
        'name',
        'email',
        'status',
        'role',
        'created_at',
        'updated_at',
    ];

    /**
     * Đảm bảo primary key được set đúng
     */
    protected $primaryKey = 'id';
    
    /**
     * Tên table
     */
    protected $table = 'users';

    /**
     * Set up rule cho tạo mới 
     */
    public static $rules = [
        'name'     => 'required|string|min:6|max:255',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|min:6',
        'role'     => 'required|string|in:user,super_admin,admin',
        'status'   => 'required|string|in:active,inactive',
    ];

    /**
     * Set up rule cho cập nhật
     */
    public static $updateRules = [
        'name'     => 'required|string|min:6|max:255',
        'role'     => 'required|string|in:user,super_admin,admin',
        'status'   => 'required|string|in:active,inactive',
    ];

    /**
     * Set up rule cho xóa
     */
    public static $deleteRules = [
        'id' => 'required|exists:users,id',
    ];

    /**
     * Hàm kiểm tra dữ liệu
     * @param array $data
     * @param array $rules
     * @return void
     * @throws \Exception
     */
    protected static function validateData($data, $rules)
    {
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) throw new \Exception($validator->errors()->first());
    }
    
    /**
     * Hàm kiểm tra dữ liệu
     * @return void
     */
    protected static function booted()
    {
        // Khi sửa
        static::updating(function ($user) {
            static::validateData($user->toArray(), static::$updateRules);
        });

        // Khi thêm
        static::creating(function ($user) {
            static::validateData($user->toArray(), static::$rules);
        });
        
        // Khi xóa
        static::deleting(function ($user) {
            static::validateData($user->toArray(), static::$deleteRules);
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'name' => 'string',
            'email' => 'string',
            'password' => 'hashed',
            'status' => 'string',
            'role' => 'string',
        ];
    }

    // ========================================
    // Tạo các method để Sanctum có thể sử dụng
    // ========================================

    /**
     * Lấy tên của unique identifier cho user
     */
    public function getAuthIdentifierName(): string
    {
        return $this->getKeyName();
    }

    /**
     * Lấy unique identifier cho user
     */
    public function getAuthIdentifier(): mixed
    {
        return $this->getAttribute($this->getAuthIdentifierName());
    }

    /**
     * Lấy password cho user
     */
    public function getAuthPassword(): string
    {
        return $this->password;
    }

    /**
     * Lấy token value cho "remember me" session
     */
    public function getRememberToken(): ?string
    {
        return $this->remember_token;
    }

    /**
     * Set token value cho "remember me" session
     */
    public function setRememberToken($value): void
    {
        $this->remember_token = $value;
    }

    /**
     * Lấy tên của column cho "remember me" token
     */
    public function getRememberTokenName(): string
    {
        return 'remember_token';
    }

    /**
     * Lấy tên của column cho password
     */
    public function getAuthPasswordName(): string
    {
        return 'password';
    }

    // ========================================
    // Helper methods cho phân quyền
    // ========================================

    /**
     * Kiểm tra user có phải role cụ thể
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Kiểm tra user có một trong các role
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Kiểm tra có phải user thường
     */
    public function isUser(): bool
    {
        return $this->hasRole('user');
    }

    /**
     * Kiểm tra có phải admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Kiểm tra có phải super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }

    /**
     * Kiểm tra có quyền quản lý (admin hoặc super_admin)
     */
    public function canManage(): bool
    {
        return $this->hasAnyRole(['admin', 'super_admin']);
    }

    /**
     * Kiểm tra có thể tác động đến user khác
     */
    public function canManageUser(User $targetUser): bool
    {
        // Super admin có thể manage tất cả
        if ($this->isSuperAdmin()) {
            return true;
        }

        // Admin không thể manage admin khác hoặc super_admin
        if ($this->isAdmin()) {
            return !$targetUser->hasAnyRole(['admin', 'super_admin']);
        }

        // User thường chỉ manage được chính mình
        if ($this->isUser()) {
            return $this->id === $targetUser->id;
        }

        return false;
    }
}
