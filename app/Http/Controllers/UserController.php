<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Froiden\RestAPI\ApiController;
use Illuminate\Support\Facades\Log;
use App\Http\Request\UpdateUserRequest;
use Illuminate\Support\Facades\Validator;
use Froiden\RestAPI\ApiResponse;

class UserController extends ApiController
{
    //
    protected $model = User::class;
    
    /**
     * Lấy danh sách user với phân trang
     */
    public function paginate(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);
        
        // Giới hạn số lượng tối đa mỗi trang
        if ($perPage > 100) {
            $perPage = 100;
        }
        
        $users = User::query()
            ->select(['id', 'name', 'email', 'status', 'role', 'created_at', 'updated_at'])
            ->paginate($perPage, ['*'], 'page', $page);
        
        // Tạo metadata phân trang
        $meta = [
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
            'from' => $users->firstItem(),
            'to' => $users->lastItem(),
            'has_more_pages' => $users->hasMorePages(),
            'next_page_url' => $users->nextPageUrl(),
            'prev_page_url' => $users->previousPageUrl(),
            'first_page_url' => $users->url(1),
            'last_page_url' => $users->url($users->lastPage()),
        ];
        
        return ApiResponse::make("Users retrieved successfully", $users->items(), $meta);
    }
    
    /**
     * Lấy tất cả user với đầy đủ tính năng của Froiden API
     * URL: /api/users-full
     */
    public function allWithFroiden(Request $request)
    {
        // Tùy chỉnh query với select fields cụ thể
        $this->query = User::query()
            ->select(['id', 'name', 'email', 'status', 'role', 'created_at', 'updated_at']);
        
        // Gọi method index() của ApiController để có đầy đủ tính năng
        $response = $this->index($request);
        
        // Nếu response là collection, thêm metadata phân trang
        if (method_exists($response, 'getData')) {
            $data = $response->getData();
            
            // Thêm metadata phân trang vào response
            $meta = [
                'current_page' => $request->get('page', 1),
                'per_page' => $request->get('per_page', 10),
                'total' => $this->query->count(),
                'has_more_pages' => $this->query->count() > ($request->get('per_page', 10) * $request->get('page', 1)),
                'message' => 'Users retrieved with pagination and sorting'
            ];
            
            return ApiResponse::make("Users retrieved successfully", $data->data ?? $data, $meta);
        }
        
        return $response;
    }

    /**
     * Lấy tất cả user (không phân trang) URL: /api/users-all
     */
    public function all()
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'status', 'role', 'created_at', 'updated_at'])
            ->get();
            
        $meta = [
            'total' => $users->count(),
            'message' => 'All users retrieved without pagination'
        ];
        
        return ApiResponse::make("All users retrieved successfully", $users->toArray(), $meta);
    }
}