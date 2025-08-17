<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Mail\VerificationCodeMail;

class EmailVerificationService
{
    private const VERIFICATION_PREFIX = 'email_verification:';
    private const RESEND_PREFIX = 'resend_count:';
    private const MAX_RESEND_ATTEMPTS = 2; // tối đa 2 lần gửi lại mã xác thực trong 10 phút
    private const RESEND_WINDOW_MINUTES = 10; // gửi lại mã xác thực trong 10 phút
    private const VERIFICATION_EXPIRE_MINUTES = 15; // mã xác thực có hiệu lực trong 15 phút

    /**
     * Gửi mã xác thực email
     */
    public function sendVerificationCode(string $email): array
    {
        // Kiểm tra số lần gửi lại trong 10 phút
        if (!$this->canResendCode($email)) {
            return [
                'success' => false,
                'message' => 'Bạn đã gửi mã xác thực quá nhiều lần. Vui lòng đợi 10 phút.',
                'remaining_time' => $this->getRemainingResendTime($email)
            ];
        }

        // Tạo mã xác thực 6 chữ số
        $verificationCode = $this->generateVerificationCode();
        
        // Lưu mã vào Redis với thời gian hết hạn 15 phút
        $this->storeVerificationCode($email, $verificationCode);
        
        // Tăng số lần gửi lại
        $this->incrementResendCount($email);
        
        // Gửi email thông qua queue
        try {
            Mail::to($email)->queue(new VerificationCodeMail($verificationCode));
            
            Log::info('Mã xác thực đã được gửi', [
                'email' => $email,
                'code' => $verificationCode
            ]);
            
            return [
                'success' => true,
                'message' => 'Mã xác thực đã được gửi đến email của bạn.',
                'expires_in' => self::VERIFICATION_EXPIRE_MINUTES
            ];
        } catch (\Exception $e) {
            Log::error('Lỗi gửi email xác thực', [
                'email' => $email,
                'error' => $e->getMessage()
            ]);
            
            // Xóa mã đã lưu nếu gửi email thất bại
            $this->removeVerificationCode($email);
            $this->decrementResendCount($email);
            
            return [
                'success' => false,
                'message' => 'Không thể gửi mã xác thực. Vui lòng thử lại sau.'
            ];
        }
    }

    /**
     * Xác thực mã
     */
    public function verifyCode(string $email, string $code): array
    {
        $storedCode = $this->getVerificationCode($email);
        
        if (!$storedCode) {
            return [
                'success' => false,
                'message' => 'Mã xác thực không tồn tại hoặc đã hết hạn.'
            ];
        }
        
        if ($storedCode !== $code) {
            return [
                'success' => false,
                'message' => 'Mã xác thực không chính xác.'
            ];
        }
        
        // Xóa mã sau khi xác thực thành công
        $this->removeVerificationCode($email);
        $this->resetResendCount($email);
        
        // Lưu trạng thái email đã được xác thực
        $this->markEmailAsVerified($email);
        
        Log::info('Email xác thực thành công', ['email' => $email]);
        
        return [
            'success' => true,
            'message' => 'Email đã được xác thực thành công.'
        ];
    }

    /**
     * Kiểm tra xem có thể gửi lại mã không
     */
    private function canResendCode(string $email): bool
    {
        $resendCount = $this->getResendCount($email);
        return $resendCount < self::MAX_RESEND_ATTEMPTS;
    }

    /**
     * Lấy thời gian còn lại để có thể gửi lại
     */
    private function getRemainingResendTime(string $email): int
    {
        $lastResendTime = Redis::get(self::RESEND_PREFIX . $email);
        if (!$lastResendTime) return 0;
        // Tính thời gian đã trôi qua
        $elapsedMinutes = (time() - $lastResendTime) / 60;
        $remainingMinutes = self::RESEND_WINDOW_MINUTES - $elapsedMinutes;
        // Trả về thời gian còn lại
        return max(0, (int) $remainingMinutes);
    }

    /**
     * Tạo mã xác thực 6 chữ số
     */
    private function generateVerificationCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Lưu mã xác thực vào Redis
     */
    private function storeVerificationCode(string $email, string $code): void
    {
        $key = self::VERIFICATION_PREFIX . $email;
        Log::info('Lưu mã xác thực vào Redis', ['email' => $email, 'code' => $code]);
        Redis::setex($key, self::VERIFICATION_EXPIRE_MINUTES * 60, $code); // 15 phút
    }

    /**
     * Lấy mã xác thực từ Redis
     */
    private function getVerificationCode(string $email): ?string
    {
        $key = self::VERIFICATION_PREFIX . $email;
        return Redis::get($key);
    }

    /**
     * Xóa mã xác thực
     */
    private function removeVerificationCode(string $email): void
    {
        $key = self::VERIFICATION_PREFIX . $email;
        Redis::del($key);
    }

    /**
     * Lấy số lần gửi lại
     */
    private function getResendCount(string $email): int
    {
        $key = self::RESEND_PREFIX . $email;
        return (int) Redis::get($key) ?? 0;
    }

    /**
     * Tăng số lần gửi lại
     */
    private function incrementResendCount(string $email): void
    {
        $key = self::RESEND_PREFIX . $email;
        $count = $this->getResendCount($email);
        // Nếu số lần gửi lại là 0 thì set thời gian hết hạn là 10 phút
        $count === 0
            ? Redis::setex($key, self::RESEND_WINDOW_MINUTES * 60, 1)
            : Redis::incr($key);
    }

    /**
     * Giảm số lần gửi lại (khi gửi email thất bại)
     */
    private function decrementResendCount(string $email): void
    {
        $key = self::RESEND_PREFIX . $email;
        $count = $this->getResendCount($email);
        // Nếu số lần gửi lại lớn hơn 0 thì giảm số lần gửi lại
        if ($count > 0) Redis::decr($key);
    }

    /**
     * Reset số lần gửi lại (sau khi xác thực thành công)
     */
    private function resetResendCount(string $email): void
    {
        $key = self::RESEND_PREFIX . $email;
        Redis::del($key);
    }

    /**
     * Đánh dấu email đã được xác thực
     * @param string $email
     * @return void
     */
    private function markEmailAsVerified(string $email): void
    {
        $key = 'email_verified:' . $email;
        $expireTime = 30 * 60; // 30 phút để hoàn tất đăng ký
        Redis::setex($key, $expireTime, '1');
    }
}
