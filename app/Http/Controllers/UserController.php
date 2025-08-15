<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Froiden\RestAPI\ApiController;
use Illuminate\Support\Facades\Log;

class UserController extends ApiController
{
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
     * Sử dụng phân trang tự động của thư viện laravel-rest-api
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
        // Sử dụng phương thức index() có sẵn từ ApiController
        // Nó sẽ tự động xử lý:
        // - fields: chọn trường cụ thể
        // - filters: lọc dữ liệu  
        // - order: sắp xếp
        // - pagination: limit và offset
        return parent::index();
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