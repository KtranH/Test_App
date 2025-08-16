<?php 

namespace App\Services;
use App\Http\Requests\AuthRequest;
use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuthService
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    /**
     * Hàm đăng ký
     * @param AuthRequest $request
     * @return array
     */
    public function register(AuthRequest $request)
    {
        // Validate dữ liệu đầu vào - sử dụng Form Request validation
        $validated = $request->validated();

        // Tạo user mới thông qua repository
        $user = $this->userRepository->createFromRequest($request);    

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;
        Log::info('User đăng ký thành công', ['user_id' => $user->id, 'email' => $user->email]);
        return [$token, $user];
    }

    /**
     * Hàm đăng nhập
     * @param AuthRequest $request
     * @param User $user
     * @return array
     */
    public function login(AuthRequest $request, User $user)
    {
        // Validate dữ liệu đầu vào - sử dụng Form Request validation
        $validated = $request->validated();
        // Tạo token mới
        $token = $user->createToken('auth_token')->plainTextToken;

        Log::info('User đăng nhập thành công', ['user_id' => $user->id, 'email' => $user->email]);
        return [$token, $user];
    }

    /**
     * Hàm đăng xuất
     * @param Request $request
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            // Xóa tất cả tokens của user
            $user->tokens()->delete();
            
            Log::info('User đăng xuất thành công', ['user_id' => $user->id]);
        }
    }

    /**
     * Hàm lấy thông tin user
     * @param Request $request
     * @return User
     */
    public function me(Request $request)
    {
        $user = $request->user();
            
        if (!$user) {
            return null;
        }
        return $user;
    }

    /**
     * Hàm làm mới token
     * @param User $user
     * @return string
     */
    public function refreshToken(Request $request)
    {
        $user = $request->user();
        if (!$user) return null;
        // Xóa token cũ
        $user->currentAccessToken()->delete();
        
        // Tạo token mới
        $token = $user->createToken('auth_token')->plainTextToken;
        Log::info('Token refreshed thành công', ['user_id' => $user->id]);
        return $token;
    }
}