<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\EmailVerificationRequest;
use App\Services\AuthService;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * Gửi mã xác thực email
     * @param Request $request
     * @return JsonResponse
     */
    public function sendVerificationCode(EmailVerificationRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->sendVerificationCode($request->email);
            return $result['success']
                ? $this->success($result['message'], $result['data'] ?? null)
                : $this->error($result['message']);
        } catch (\Exception $e) {
            Log::error('Gửi mã xác thực thất bại', ['error' => $e->getMessage()]);
            return $this->error('Gửi mã xác thực thất bại: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Xác thực mã email và tự động tạo tài khoản
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyEmailWithRegistration(EmailVerificationRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->verifyEmailWithRegistration($request->all());
            return $result['success']
                ? $this->success($result['message'], $result)
                : $this->error($result['message']);
        } catch (\Exception $e) {
            Log::error('Xác thực email với đăng ký thất bại', ['error' => $e->getMessage()]);
            return $this->error('Xác thực email với đăng ký thất bại: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Hàm đăng nhập
     * @param AuthRequest $request
     * @return JsonResponse
     */
    public function login(AuthRequest $request): JsonResponse
    {
        try {
            if (!$this->checkLogin($request)) return $this->error('Invalid credentials - Sai tài khoản hoặc mật khẩu', null, 401);
            $user = Auth::guard('web')->user();
            if (!$this->checkStatus($user)) return $this->error('Account is not active - Tài khoản không hoạt động', null, 403);
            // Đăng nhập
            [$token, $user] = $this->authService->login($user);
            return $this->success('Đăng nhập thành công', ['token' => $token, 'user' => $user]);

        } catch (\Exception $e) {
            Log::error('Đăng nhập thất bại', ['error' => $e->getMessage()]);
            return $this->error('Đăng nhập thất bại: ' . $e->getMessage(), null, 500);
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
            return $this->success('Đăng xuất thành công');

        } catch (\Exception $e) {
            Log::error('Đăng xuất thất bại', ['error' => $e->getMessage()]);
            return $this->error('Đăng xuất thất bại: ' . $e->getMessage(), null, 500);
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
            if (!$user) return $this->error('Unauthenticated', null, 401);
            return $this->success('Lấy thông tin user thành công', ['user' => $user]);

        } catch (\Exception $e) {
            Log::error('Lấy thông tin user thất bại', ['error' => $e->getMessage()]);
            return $this->error('Lấy thông tin user thất bại: ' . $e->getMessage(), null, 500);
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
            if (!$token) return $this->error('Unauthenticated', null, 401);
            Log::info('Token refreshed thành công');
            return $this->success('Token refreshed thành công', ['token' => $token]);

        } catch (\Exception $e) {
            Log::error('Token refresh thất bại', ['error' => $e->getMessage()]);
            return $this->error('Token refresh thất bại: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Hàm kiểm tra thông tin đăng nhập
     * @param AuthRequest $request
     * @return bool
     */
    private function checkLogin(AuthRequest $request): bool
    {
        return Auth::guard('web')->attempt($request->only('email', 'password'));
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
}
