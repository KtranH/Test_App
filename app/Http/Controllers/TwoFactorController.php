<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use PragmaRX\Google2FA\Google2FA;
use App\Services\AuthService;
use App\Models\User;

class TwoFactorController extends Controller
{
    /**
     * Trả trạng thái 2FA cho user hiện tại
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        return $this->success('Lấy trạng thái 2FA thành công', [
            'enabled' => !empty($user?->google2fa_secret),
        ]);
    }

    /**
     * Bước 1: Khởi tạo bật 2FA - tạo secret tạm thời và trả về otpauth URL
     */
    public function initEnable(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) return $this->error('Unauthenticated', null, 401);

        if (!empty($user->google2fa_secret)) {
            return $this->error('2FA đã được bật. Vui lòng tắt trước khi bật lại.', null, 400);
        }

        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey(32);

        $issuer = config('app.name');
        $otpauthUrl = $google2fa->getQRCodeUrl($issuer, $user->email, $secret);

        // Lưu secret tạm trong cache 10 phút
        Cache::put($this->getSetupCacheKey($user->id), $secret, now()->addMinutes(10));

        return $this->success('Khởi tạo 2FA thành công', [
            'secret' => $secret,
            'otpauth_url' => $otpauthUrl,
        ]);
    }

    /**
     * Bước 2: Xác nhận bật 2FA bằng OTP
     */
    public function confirmEnable(Request $request): JsonResponse
    {
        $request->validate([
            'otp' => 'required|string',
        ]);

        $user = $request->user();
        if (!$user) return $this->error('Unauthenticated', null, 401);

        if (!empty($user->google2fa_secret)) {
            return $this->error('2FA đã được bật.', null, 400);
        }

        $secret = Cache::get($this->getSetupCacheKey($user->id));
        if (!$secret) return $this->error('Phiên thiết lập 2FA đã hết hạn. Vui lòng khởi tạo lại.', null, 400);

        $google2fa = new Google2FA();
        $isValid = $google2fa->verifyKey($secret, $request->input('otp'));
        if (!$isValid) return $this->error('OTP không hợp lệ.', null, 422);

        // Lưu secret vào database và xóa cache tạm
        $user->google2fa_secret = $secret;
        $user->save();
        Cache::forget($this->getSetupCacheKey($user->id));

        return $this->success('Bật 2FA thành công', ['enabled' => true]);
    }

    /**
     * Tắt 2FA sau khi xác thực OTP hiện tại
     */
    public function disable(Request $request): JsonResponse
    {
        $request->validate([
            'otp' => 'required|string',
        ]);

        $user = $request->user();
        if (!$user) return $this->error('Unauthenticated', null, 401);
        if (empty($user->google2fa_secret)) return $this->error('2FA chưa được bật.', null, 400);

        $google2fa = new Google2FA();
        $isValid = $google2fa->verifyKey($user->google2fa_secret, $request->input('otp'));
        if (!$isValid) return $this->error('OTP không hợp lệ.', null, 422);

        $user->google2fa_secret = null;
        $user->save();

        return $this->success('Tắt 2FA thành công', ['enabled' => false]);
    }

    /**
     * Xác thực OTP cho bước đăng nhập (khi 2FA bật)
     */
    public function verifyLogin(Request $request): JsonResponse
    {
        $request->validate([
            'challenge_id' => 'required|string',
            'otp' => 'required|string',
        ]);

        $cacheKey = $this->getLoginCacheKey($request->input('challenge_id'));
        $payload = Cache::get($cacheKey);
        if (!$payload) return $this->error('Phiên xác thực 2FA không hợp lệ hoặc đã hết hạn.', null, 400);

        $userId = $payload['user_id'] ?? null;
        $remember = (bool)($payload['remember'] ?? false);
        if (!$userId) return $this->error('Phiên xác thực không hợp lệ.', null, 400);

        $user = User::find($userId);
        if (!$user || empty($user->google2fa_secret)) return $this->error('User không hợp lệ hoặc chưa bật 2FA.', null, 400);

        $google2fa = new Google2FA();
        $isValid = $google2fa->verifyKey($user->google2fa_secret, $request->input('otp'));
        if (!$isValid) return $this->error('OTP không hợp lệ.', null, 422);

        // Đã xác thực thành công -> cấp token và xóa cache challenge
        Cache::forget($cacheKey);

        // Đăng nhập và tạo token thông qua AuthService cho thống nhất
        $authService = app(AuthService::class);
        [$token, $user, $expiresAt] = $authService->login($user, $remember);

        return $this->success('Xác thực 2FA đăng nhập thành công', [
            'token' => $token,
            'user' => $user,
            'expires_at' => $expiresAt?->toISOString(),
        ]);
    }

    private function getSetupCacheKey(int $userId): string
    {
        return '2fa:setup:' . $userId;
    }

    private function getLoginCacheKey(string $challengeId): string
    {
        return '2fa:login:' . $challengeId;
    }
}
