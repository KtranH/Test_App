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
     * Default number of records to return
     * @var int
     */
    protected $defaultLimit = 10;
    
    /**
     * Maximum number of records allowed to be returned in single request
     * @var int
     */
    protected $maxLimit = 100;

    /**
     * Constructor - đảm bảo user đã authenticate
     */
    public function __construct()
    {
        parent::__construct();
        $this->middleware('auth:sanctum');
    }

    /**
     * Danh sách users với phân quyền
     * 
     * API Endpoints:
     * GET /api/users?limit=20&offset=0
     * GET /api/users?fields=id,name,email&limit=15&offset=30
     * GET /api/users?filters=(status eq "active")&limit=10&offset=0
     * GET /api/users?order=name asc&limit=25&offset=50
     * 
     * @return mixed
     */
    public function index()
    {
        // Kiểm tra quyền xem danh sách user
        $this->authorize('viewAny', User::class);
        
        return parent::index();
    }
    
    /**
     * Hiển thị thông tin user cụ thể
     */
    public function show(...$args)
    {
        $id = $args[0] ?? null;
        $user = User::findOrFail($id);
        
        // Kiểm tra quyền xem user này
        $this->authorize('view', $user);
        return parent::show(...$args);
    }

    /**
     * Tạo user mới
     */
    public function store()
    {
        // Kiểm tra quyền tạo user
        $this->authorize('create', User::class);
        return parent::store();
    }

    /**
     * Cập nhật user
     */
    public function update(...$args)
    {
        $id = null;
        foreach ($args as $arg) {
            if (is_numeric($arg) || (is_string($arg) && ctype_digit($arg))) {
                $id = $arg;
                break;
            }
        }
        
        if ($id) {
            $user = User::findOrFail($id);
            // Kiểm tra quyền cập nhật user này
            $this->authorize('update', $user);
        }
        return parent::update(...$args);
    }

    /**
     * Xóa user
     */
    public function destroy(...$args)
    {
        $id = $args[0] ?? null;
        $user = User::findOrFail($id);
        
        // Kiểm tra quyền xóa user này
        $this->authorize('delete', $user);
        return parent::destroy(...$args);
    }
    
    /**
     * @deprecated Sử dụng GET /api/users thay thế
     * Method cũ để tương thích ngược
     */
    public function paginate(Request $request)
    {
        // Redirect to new index method
        return $this->index();
    }
}