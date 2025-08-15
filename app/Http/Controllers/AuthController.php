<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\AuthRequest;

class AuthController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    /**
     * Đăng ký tài khoản mới
     */
    public function register(AuthRequest $request): JsonResponse
    {
        try {
            // Validate dữ liệu đầu vào - sử dụng Form Request validation
            $validated = $request->validated();

            // Tạo user mới thông qua repository
            $user = $this->userRepository->createFromRequest($request);    

            // Tạo token
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('User đăng ký thành công', ['user_id' => $user->id, 'email' => $user->email]);

            return $this->response201('User đăng ký thành công', ['token' => $token, 'user' => $user]);

        } catch (\Exception $e) {
            Log::error('Đăng ký thất bại', ['error' => $e->getMessage()]);
            
            return $this->response500('Đăng ký thất bại: ' . $e->getMessage());
        }
    }

    /**
     * Đăng nhập
     */
    public function login(AuthRequest $request): JsonResponse
    {
        try {
            // Validate dữ liệu đầu vào - sử dụng Form Request validation
            $validated = $request->validated();

            // Kiểm tra thông tin đăng nhập - sử dụng web guard
            if (!Auth::guard('web')->attempt($request->only('email', 'password'))) {
                return $this->response401('Invalid credentials - Sai tài khoản hoặc mật khẩu');
            }

            $user = Auth::guard('web')->user();

            // Kiểm tra trạng thái tài khoản
            if ($user->status !== 'active') {
                Auth::guard('web')->logout();
                return $this->response403('Account is not active - Tài khoản không hoạt động');
            }

            // Tạo token mới
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('User đăng nhập thành công', ['user_id' => $user->id, 'email' => $user->email]);

            return $this->response200('Đăng nhập thành công', ['token' => $token, 'user' => $user]);

        } catch (\Exception $e) {
            Log::error('Đăng nhập thất bại', ['error' => $e->getMessage()]);
            
            return $this->response500('Đăng nhập thất bại: ' . $e->getMessage());
        }
    }

    /**
     * Đăng xuất
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if ($user) {
                // Xóa tất cả tokens của user
                $user->tokens()->delete();
                
                Log::info('User đăng xuất thành công', ['user_id' => $user->id]);
            }

            return $this->response200('Đăng xuất thành công');

        } catch (\Exception $e) {
            Log::error('Đăng xuất thất bại', ['error' => $e->getMessage()]);
            
            return $this->response500('Đăng xuất thất bại: ' . $e->getMessage());
        }
    }

    /**
     * Lấy thông tin user hiện tại
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return $this->response401('Unauthenticated');
            }

            return $this->response200('Lấy thông tin user thành công', ['user' => $user]);

        } catch (\Exception $e) {
            Log::error('Lấy thông tin user thất bại', ['error' => $e->getMessage()]);
            
            return $this->response500('Lấy thông tin user thất bại: ' . $e->getMessage());
        }
    }

    /**
     * Refresh token
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return $this->response401('Unauthenticated');
            }

            // Xóa token cũ
            $request->user()->currentAccessToken()->delete();
            
            // Tạo token mới
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Token refreshed thành công', ['user_id' => $user->id]);

            return $this->response200('Token refreshed thành công', ['token' => $token]);

        } catch (\Exception $e) {
            Log::error('Token refresh thất bại', ['error' => $e->getMessage()]);
            
            return $this->response500('Token refresh thất bại: ' . $e->getMessage());
        }
    }

    /**
     * Cập nhật thông tin profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
                'phone' => 'sometimes|string|max:20',
                'address' => 'sometimes|string|max:500',
            ]);

            if ($validator->fails()) {
                return $this->response422($validator, 'Validation failed');
            }

            $user = $request->user();
            
            // Cập nhật thông tin user
            $user->update($request->only(['name', 'email', 'phone', 'address']));

            Log::info('Cập nhật profile thành công', ['user_id' => $user->id]);

            return $this->response200('Cập nhật profile thành công', ['user' => $user]);

        } catch (\Exception $e) {
            Log::error('Cập nhật profile thất bại', ['error' => $e->getMessage()]);
            
            return $this->response500('Cập nhật profile thất bại: ' . $e->getMessage());
        }
    }

    /**
     * Thay đổi mật khẩu
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:6|confirmed',
            ]);

            if ($validator->fails()) {
                return $this->response422($validator, 'Validation failed');
            }

            $user = $request->user();
            
            // Kiểm tra mật khẩu hiện tại
            if (!Hash::check($request->current_password, $user->password)) {
                return $this->response400('Current password is incorrect');
            }

            // Cập nhật mật khẩu mới
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            Log::info('Thay đổi mật khẩu thành công', ['user_id' => $user->id]);

            return $this->response200('Thay đổi mật khẩu thành công');

        } catch (\Exception $e) {
            Log::error('Thay đổi mật khẩu thất bại', ['error' => $e->getMessage()]);
            
            return $this->response500('Thay đổi mật khẩu thất bại: ' . $e->getMessage());
        }
    }
}
