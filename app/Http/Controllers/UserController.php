<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\User;
use Froiden\RestAPI\ApiController;

class UserController extends ApiController
{
    use AuthorizesRequests;
    
    protected $model = User::class;
    
    /**
     * Số lượng bản ghi trả về mặc định
     * @var int
     */
    protected $defaultLimit = 10;
    
    /**
     * Tối đa số lượng bản ghi trả về trong một request
     * @var int
     */
    protected $maxLimit = 100;

    /**
     * Constructor - đảm bảo user đã authenticate
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Tùy biến trước khi lấy danh sách user
     * @param mixed $query
     */
    protected function modifyIndex($query)
    {
        // Phân quyền xem danh sách trước khi thực thi truy vấn
        $this->authorize('viewAny', User::class);
        return $query;
    }

    /**
     * Tùy biến trước khi lấy chi tiết user
     * @param mixed $query
     */
    protected function modifyShow($query)
    {
        // Thực hiện phân quyền theo bản ghi
        $id = request()->route('user') ?? (request()->route()?->parameter('id')) ?? null;
        if ($id !== null) {
            $user = User::findOrFail($id);
            $this->authorize('view', $user);
        }
        return $query;
    }

    /**
     * Tùy biến trước khi tạo user
     * @param User $user
     * @return User
     */
    protected function storing(User $user): User
    {
        // Chạy trước khi tạo trong transaction
        $this->authorize('create', User::class);
        return $user;
    }

    /**
     * Tùy biến trước khi cập nhật user
     * @param User $user
     * @return User
     */
    protected function updating(User $user): User
    {
        // Chạy trước khi cập nhật trong transaction
        $this->authorize('update', $user);
        return $user;
    }

    /**
     * Tùy biến trước khi xoá user
     * @param User $user
     * @return User
     */
    protected function destroying(User $user): User
    {
        // Chạy trước khi xoá trong transaction
        $this->authorize('delete', $user);
        return $user;
    }
}