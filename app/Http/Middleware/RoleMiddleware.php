<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class RoleMiddleware
{
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
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated - Vui lòng đăng nhập',
            ], 401);
        }

        /** @var User $user */
        $user = Auth::user();

        // Kiểm tra trạng thái tài khoản
        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Account is not active - Tài khoản không hoạt động',
            ], 403);
        }

        // Nếu không có role nào được chỉ định, chỉ cần authenticated
        if (empty($roles)) {
            return $next($request);
        }

        // Kiểm tra user có role phù hợp không
        if (!$user->hasAnyRole($roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions - Không đủ quyền truy cập',
                'required_roles' => $roles,
                'user_role' => $user->role,
            ], 403);
        }

        return $next($request);
    }
}
