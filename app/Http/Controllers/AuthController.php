<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\AuthRequest;
use App\Services\AuthService;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * Đăng ký tài khoản mới
     * @param AuthRequest $request
     * @return JsonResponse
     */
    public function register(AuthRequest $request): JsonResponse
    {
        try {
            [$token, $user] = $this->authService->register($request);
            return $this->response201('User đăng ký thành công', ['token' => $token, 'user' => $user]);
        } catch (\Exception $e) {
            Log::error('Đăng ký thất bại', ['error' => $e->getMessage()]);
            return $this->response500('Đăng ký thất bại: ' . $e->getMessage());
        }
    }

    /**
     * Hàm kiểm tra thông tin đăng nhập
     * @param AuthRequest $request
     * @return bool
     */
    private function checkLogin(AuthRequest $request): bool
    {
        if (!Auth::guard('web')->attempt($request->only('email', 'password'))) {
            return false;
        }
        return true;
    }

    /**
     * Hàm kiểm tra trạng thái tài khoản
     * @param User $user
     * @return bool
     */
    private function checkStatus(User $user): bool
    {
        if ($user->status !== 'active') {
            Auth::guard('web')->logout();
            return false;
        }
        return true;
    }

    /**
     * Hàm đăng nhập
     * @param AuthRequest $request
     * @return JsonResponse
     */
    public function login(AuthRequest $request): JsonResponse
    {
        try {
            if (!$this->checkLogin($request)) return $this->response401('Invalid credentials - Sai tài khoản hoặc mật khẩu');
            $user = Auth::guard('web')->user();
            if (!$this->checkStatus($user)) return $this->response403('Account is not active - Tài khoản không hoạt động');
            
            [$token, $user] = $this->authService->login($request, $user);
            return $this->response200('Đăng nhập thành công', ['token' => $token, 'user' => $user]);

        } catch (\Exception $e) {
            Log::error('Đăng nhập thất bại', ['error' => $e->getMessage()]);
            return $this->response500('Đăng nhập thất bại: ' . $e->getMessage());
        }
    }

    /**
     * Đăng xuất
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $this->authService->logout($request);
            return $this->response200('Đăng xuất thành công');

        } catch (\Exception $e) {
            Log::error('Đăng xuất thất bại', ['error' => $e->getMessage()]);
            return $this->response500('Đăng xuất thất bại: ' . $e->getMessage());
        }
    }

    /**
     * Lấy thông tin user hiện tại
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $this->authService->me($request);
            if (!$user) return $this->response401('Unauthenticated');
            return $this->response200('Lấy thông tin user thành công', ['user' => $user]);

        } catch (\Exception $e) {
            Log::error('Lấy thông tin user thất bại', ['error' => $e->getMessage()]);
            return $this->response500('Lấy thông tin user thất bại: ' . $e->getMessage());
        }
    }

    /**
     * Refresh token
     * @param Request $request
     * @return JsonResponse
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $token = $this->authService->refreshToken($request);
            if (!$token) return $this->response401('Unauthenticated');
            Log::info('Token refreshed thành công');
            return $this->response200('Token refreshed thành công', ['token' => $token]);

        } catch (\Exception $e) {
            Log::error('Token refresh thất bại', ['error' => $e->getMessage()]);
            return $this->response500('Token refresh thất bại: ' . $e->getMessage());
        }
    }
}
