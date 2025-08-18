<?php 

namespace App\Services;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\EmailVerificationRequest;
use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class AuthService
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private EmailVerificationService $emailVerificationService
    ) {}

    /**
     * Gửi mã xác thực email
     * @param string $email
     * @return array
     */
    public function sendVerificationCode(string $email): array
    {
        // Kiểm tra email đã tồn tại chưa
        $existingUser = $this->userRepository->findByEmail($email);
        if ($existingUser) {
            return [
                'success' => false,
                'message' => 'Email này đã được sử dụng để đăng ký tài khoản.'
            ];
        }

        return $this->emailVerificationService->sendVerificationCode($email);
    }

    /**
     * Hàm xác thực mã email và tự động tạo tài khoản nếu có thông tin đăng ký
     * @param array $data
     * @return array
     */
    public function verifyEmailWithRegistration(array $data): array
    {
        // Xác thực mã email
        $verificationResult = $this->emailVerificationService->verifyCode(
            $data['email'], 
            $data['verification_code']
        );

        if (!$verificationResult['success']) {
            return $verificationResult;
        }

        // Kiểm tra xem có thông tin đăng ký không
        if (isset($data['registration_data']) && $data['registration_data']) {
            $registrationData = $data['registration_data'];
            
            // Kiểm tra email có khớp không
            if ($registrationData['email'] !== $data['email']) {
                return [
                    'success' => false,
                    'message' => 'Email không khớp với thông tin đăng ký!'
                ];
            }

            // Tạo user mới
            $user = $this->userRepository->createFromArray($registrationData);
            $token = $user->createToken('auth_token')->plainTextToken;
            return [
                'success' => true,
                'message' => 'Email đã được xác thực và tài khoản đã được tạo thành công!',
                'autoRegistered' => true,
                'token' => $token,
                'user' => $user
            ];
        }
        
        // Thông báo thất bại, vì không có thông tin đăng ký
        return [
            'success' => false,
            'message' => 'Không có thông tin đăng ký!',
            'autoRegistered' => false
        ];
    }

    /**
     * Hàm đăng nhập
     * @param User $user
     * @param bool $remember
     * @return array
     */
    public function login(User $user, bool $remember = false)
    {
        // Tạo token mới với expiration 60 phút
        $token = $user->createToken('auth_token', ['*'], now()->addMinutes(60))->plainTextToken;
        
        // Xử lý remember me nếu được yêu cầu
        if ($remember) {
            // Tăng expiration token lên 10080 phút (7 ngày)
            $token = $user->createToken('auth_token', ['*'], now()->addMinutes(10080))->plainTextToken;
            Log::info('User đăng nhập thành công với Remember Me', [
                'user_id' => $user->id, 
                'email' => $user->email,
                'remember' => true
            ]);
        } else {
            Log::info('User đăng nhập thành công', [
                'user_id' => $user->id, 
                'email' => $user->email
            ]);
        }
        
        // Lấy thông tin expiration từ token
        $tokenModel = $user->tokens()->latest()->first();
        
        return [$token, $user, $tokenModel->expires_at];
    }

    /**
     * Hàm đăng xuất
     * @param Request $request
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) $user->tokens()->delete();
        Log::info('User đăng xuất thành công', ['user_id' => $user->id]);
    }

    /**
     * Hàm lấy thông tin user
     * @param Request $request
     * @return User|null
     */
    public function me(Request $request)
    {
        try {
            $user = $request->user('sanctum') ?? $request->user();
            return $user?->fresh();
        } catch (\Exception $e) {
            Log::error('Error in AuthService me()', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Hàm làm mới token
     * @param Request $request
     * @return array|null
     */
    public function refreshToken(Request $request)
    {
        $user = $request->user();
        if (!$user) return null;
        
        // Xóa token cũ
        $user->currentAccessToken()->delete();
        
        // Tạo token mới với expiration 60 phút
        $token = $user->createToken('auth_token', ['*'], now()->addMinutes(60))->plainTextToken;
        
        // Lấy thông tin expiration
        $tokenModel = $user->tokens()->latest()->first();
        
        Log::info('Token refreshed thành công', ['user_id' => $user->id]);
        
        return [
            'token' => $token,
            'expires_at' => $tokenModel->expires_at
        ];
    }
}