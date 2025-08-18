<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\TwoFaRequest;
use Illuminate\Support\Facades\Log;
use App\Services\TwoFactorService;

class TwoFactorController extends Controller
{
    public function __construct(
        private TwoFactorService $twoFactorService
    ) {}

    /**
     * Trả trạng thái 2FA cho user hiện tại
     * @param Request $request
     * @return JsonResponse
     */
    public function status(Request $request): JsonResponse
    {
        try{
            $user = $request->user();
            return $this->success('Lấy trạng thái 2FA thành công', [
                'enabled' => !empty($user?->google2fa_secret),
            ]);
        } catch (\Exception $e) {
            Log::error('Lấy trạng thái 2FA thất bại', ['error' => $e->getMessage()]);
            return $this->error('Lấy trạng thái 2FA thất bại: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Bước 1: Khởi tạo bật 2FA - tạo secret tạm thời và trả về otpauth URL
     * @param Request $request
     * @return JsonResponse
     */
    public function initEnable(Request $request): JsonResponse
    {
        try
        {
            $user = $request->user();
            // Kiểm tra user đã xác thực chưa
            $checkUser = $this->twoFactorService->isUserAuthenticated($user);
            if (!$checkUser) return $this->error('Unauthenticated', null, 401);

            // Kiểm tra user đã bật 2FA chưa
            $checkUserEnabled2FA = $this->twoFactorService->isUserEnabled2FA($user);
            if ($checkUserEnabled2FA) return $this->error('2FA đã được bật. Vui lòng tắt trước khi bật lại.', null, 400);

            // Khởi tạo 2FA
            $result = $this->twoFactorService->initEnable($user);
            if (!$result) return $this->error('Khởi tạo 2FA thất bại', null, 500);

            $data = [
                'secret' => $result['secret'],
                'otpauth_url' => $result['otpauth_url'],
            ];

            return $this->success('Khởi tạo 2FA thành công', $data);
        }
        catch (\Exception $e) {
            Log::error('Khởi tạo 2FA thất bại', ['error' => $e->getMessage()]);
            return $this->error('Khởi tạo 2FA thất bại: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Bước 2: Xác nhận bật 2FA bằng OTP
     * @param TwoFaRequest $request
     * @return JsonResponse
     */
    public function confirmEnable(TwoFaRequest $request): JsonResponse
    {
        try
        {
            $user = $request->user();
            // Kiểm tra user đã xác thực chưa
            $checkUser = $this->twoFactorService->isUserAuthenticated($user);
            if (!$checkUser) return $this->error('Unauthenticated', null, 401);
    
            // Kiểm tra user đã bật 2FA chưa
            $checkUserEnabled2FA = $this->twoFactorService->isUserEnabled2FA($user);
            if ($checkUserEnabled2FA) return $this->error('2FA đã được bật. Vui lòng tắt trước khi bật lại.', null, 400);
    
            // Xác nhận bật 2FA
            $result = $this->twoFactorService->confirmEnable($user, $request->input('otp'));
            if (!$result) return $this->error('Xác nhận bật 2FA thất bại', null, 500);
    
            return $this->success('Bật 2FA thành công', ['enabled' => true]);   
        }
        catch (\Exception $e) {
            Log::error('Xác nhận bật 2FA thất bại', ['error' => $e->getMessage()]);
            return $this->error('Xác nhận bật 2FA thất bại: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Tắt 2FA sau khi xác thực OTP hiện tại
     * @param TwoFaRequest $request
     * @return JsonResponse
     */
    public function disable(TwoFaRequest $request): JsonResponse
    {
        try
        {
            $user = $request->user();
            // Kiểm tra user đã xác thực chưa
            $checkUser = $this->twoFactorService->isUserAuthenticated($user);
            if (!$checkUser) return $this->error('Unauthenticated', null, 401);

            // Kiểm tra user đã bật 2FA chưa
            $checkUserEnabled2FA = $this->twoFactorService->isUserEnabled2FA($user);
            if (!$checkUserEnabled2FA) return $this->error('2FA chưa được bật.', null, 400);

            // Tắt 2FA
            $result = $this->twoFactorService->disable($user, $request->input('otp'));
            if (!$result) return $this->error('Tắt 2FA thất bại', null, 500);   

            return $this->success('Tắt 2FA thành công', ['enabled' => false]);
        }
        catch (\Exception $e) {
            Log::error('Tắt 2FA thất bại', ['error' => $e->getMessage()]);
            return $this->error('Tắt 2FA thất bại: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Xác thực OTP cho bước đăng nhập (khi 2FA bật)
     * @param TwoFaRequest $request
     * @return JsonResponse
     */
    public function verifyLogin(TwoFaRequest $request): JsonResponse
    {
        try
        {
            $result = $this->twoFactorService->verifyLogin($request);   
        
            if ($result === 400) return $this->error('Phiên xác thực 2FA không hợp lệ hoặc đã hết hạn.', null, 400);
            if ($result === 422) return $this->error('OTP không hợp lệ.', null, 422);

            return $this->success('Xác thực 2FA đăng nhập thành công', $result);
        }
        catch (\Exception $e) {
            Log::error('Xác thực 2FA đăng nhập thất bại', ['error' => $e->getMessage()]);
            return $this->error('Xác thực 2FA đăng nhập thất bại: ' . $e->getMessage(), null, 500);
        }
    }
}
