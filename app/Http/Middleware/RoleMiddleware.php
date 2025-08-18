<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
use App\Traits\ApiResponse;

class RoleMiddleware
{
    use ApiResponse;
    
    /**
     * Handle an incoming request.
     * 
     * Sử dụng: Route::middleware('role:admin,super_admin')->group(...)
     * Hoặc: Route::middleware('role:admin')->get(...)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string ...$roles - Danh sách các role được phép
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Kiểm tra user đã đăng nhập chưa
        if (!Auth::check()) {
            return $this->error('Unauthenticated - Vui lòng đăng nhập', null, 401);
        }

        /** @var User $user */
        $user = Auth::user();

        // Kiểm tra trạng thái tài khoản
        if ($user->status !== 'active') {
            return $this->error('Account is not active - Tài khoản không hoạt động', null, 403);
        }

        // Nếu không có role nào được chỉ định, chỉ cần authenticated
        if (empty($roles)) {
            return $next($request);
        }

        // Kiểm tra user có role phù hợp không
        if (!$user->hasAnyRole($roles)) {
            $data = [
                'required_roles' => $roles,
                'user_role' => $user->role,
            ];
            return $this->error('Insufficient permissions - Không đủ quyền truy cập', $data, 403);
        }

        return $next($request);
    }
}
