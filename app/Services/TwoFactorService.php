<?php

namespace App\Services;
use App\Models\User;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Facades\Cache;
use App\Services\AuthService;

class TwoFactorService
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * Khởi tạo bật 2FA - tạo secret tạm thời và trả về otpauth URL
     * @param Request $request
     * @return array|null
     */
   public function initEnable(User $user): array|null
   {
        // Tạo secret và lưu vào cache
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey(32);

        // Tạo URL QR code
        $issuer = config('app.name');
        $otpauthUrl = $google2fa->getQRCodeUrl($issuer, $user->email, $secret);

        // Lưu secret tạm trong cache 10 phút
        Cache::put($this->getSetupCacheKey($user->id), $secret, now()->addMinutes(10));

        return [
            'secret' => $secret,
            'otpauth_url' => $otpauthUrl,
        ];
   }

   /**
    * Xác nhận bật 2FA bằng OTP
    * @param Request $request
    * @return bool
    */
   public function confirmEnable(User $user, string $otp): bool
   {
        // Lấy secret từ cache
        $secret = Cache::get($this->getSetupCacheKey($user->id));
        if (!$secret) return false;

        // Xác thực OTP
        $google2fa = new Google2FA();
        $isValid = $google2fa->verifyKey($secret, $otp);
        if (!$isValid) return false;

        // Lưu secret vào database và xóa cache
        $user->google2fa_secret = $secret;
        $user->save();
        Cache::forget($this->getSetupCacheKey($user->id));

        return true;
   }

   /**
    * Tắt 2FA sau khi xác thực OTP hiện tại
    * @param Request $request
    * @return bool
    */
   public function disable(User $user, string $otp): bool
   {
        $google2fa = new Google2FA();
        $isValid = $google2fa->verifyKey($user->google2fa_secret, $otp);
        if (!$isValid) return false;

        $user->google2fa_secret = null;
        $user->save();

        return true;
   }

   /**
    * Xác thực OTP cho bước đăng nhập (khi 2FA bật)
    * @param Request $request
    * @return bool
    */
   public function verifyLogin(Request $request): array|int
   {
        $cacheKey = $this->getLoginCacheKey($request->input('challenge_id'));
        $payload = Cache::get($cacheKey);
        if (!$payload) return 400;

        $userId = $payload['user_id'] ?? null;
        $remember = (bool)($payload['remember'] ?? false);
        if (!$userId) return 400;

        $user = User::find($userId);
        if (!$user || empty($user->google2fa_secret)) return 400;

        $google2fa = new Google2FA();
        $isValid = $google2fa->verifyKey($user->google2fa_secret, $request->input('otp'));
        if (!$isValid) return 422;

        // Đã xác thực thành công -> cấp token và xóa cache challenge
        Cache::forget($cacheKey);

        // Đăng nhập và tạo token thông qua AuthService cho thống nhất
        [$token, $user, $expiresAt] = $this->authService->login($user, $remember);

        return [
            'token' => $token,
            'user' => $user,
            'expires_at' => $expiresAt?->toISOString()
        ];
   }

   /**
     * Lấy cache key cho bước setup 2FA
     * @param int $userId
     * @return string
     */
    private function getSetupCacheKey(int $userId): string
    {
        return '2fa:setup:' . $userId;
    }

    /**
     * Lấy cache key cho bước xác thực 2FA
     * @param string $challengeId
     * @return string
     */
    private function getLoginCacheKey(string $challengeId): string
    {
        return '2fa:login:' . $challengeId;
    }

    /**
     * Hàm kiểm tra tài khoản user đã xác thực chưa
     * @param User $user
     * @return bool
     */
    public function isUserAuthenticated(User $user): bool
    {
        if (!$user) return false;
        return true;
    }

    /**
     * Hàm kiểm tra user đã bật 2FA chưa
     * @param User $user
     * @return bool
     */
    public function isUserEnabled2FA(User $user): bool
    {
        return !empty($user->google2fa_secret);
    }
}