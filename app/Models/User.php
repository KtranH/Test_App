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
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'remember_token',
    ];

    //----------------------------------
    // Cấu hình cho Froiden Rest API
    //----------------------------------
    protected $filterable = [
        'id',
        'name',
        'email',
        'password',
        'status',
        'role',
        'created_at',
        'updated_at',
    ];

    protected $default = [
        'id',
        'name',
        'email',
        'password',
        'status',
        'role',
        'created_at',
        'updated_at',
    ];

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
}
