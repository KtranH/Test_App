<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Froiden\RestAPI\ApiModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class User extends ApiModel
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

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
    
    protected $sortable = [
        'id',
        'name',
        'email',
        'password',
        'status',
        'role',
        'created_at',
        'updated_at',
    ];
    
    protected $searchable = [
        'name',
        'email',
    ];

    protected $allowedIncludes = [
        'posts',
    ];

    protected $allowedFilters = [
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

    // Set up rule cho tạo mới 
    public static $rules = [
        'name'     => 'required|string|min:6|max:255',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|min:6',
        'role'     => 'required|string|in:user,super_admin,admin',
        'status'   => 'required|string|in:active,inactive',
    ];

    // Set up rule cho cập nhật
    public static $updateRules = [
        'name'     => 'required|string|min:6|max:255',
        'role'     => 'required|string|in:user,super_admin,admin',
        'status'   => 'required|string|in:active,inactive',
    ];

    // Set up rule cho xóa
    public static $deleteRules = [
        'id' => 'required|exists:users,id',
    ];

    // Kiểm tra dữ liệu
    protected static function booted()
    {
        // Khi sửa
        static::updating(function ($user) {
            // Kiểm tra validate 
            $validator = Validator::make($user->toArray(), static::$updateRules);
            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            }
        });

        // Khi thêm
        static::creating(function ($user) {
            // Mã hóa password
            Log::info("Kiểm tra user", $user->toArray());
            $user->password = Hash::make($user->password);
            // Kiểm tra xem password có trống không
            if (empty($user->password)) {
                throw new \Exception("Password không được để trống");
            }
            // Kiểm tra validate 
            $validator = Validator::make($user->toArray(), static::$rules);
            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            }
        });

        // Khi xóa
        static::deleting(function ($user) {
            // Kiểm tra validate 
            $validator = Validator::make($user->toArray(), static::$deleteRules);
            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            }
        });
    }

    // Kiểm tra dữ liệu khi thêm
    //----------------------------------
    
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
            'password' => 'string',
            'status' => 'string',
            'role' => 'string',
        ];
    }
}
