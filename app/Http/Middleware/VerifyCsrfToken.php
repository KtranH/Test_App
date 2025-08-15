<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Các URI cần bỏ qua CSRF
     * 
     * CHỈ BỎ QUA CHO NHỮNG ENDPOINTS THỰC SỰ PUBLIC
     * TẤT CẢ ENDPOINTS KHÁC SẼ CÓ DOUBLE PROTECTION (CSRF + SANCTUM)
     * 
     * @var array<int, string>
     */
    protected $except = [
        'api/v1/auth/login',
        'api/v1/auth/register',
        'api/v1/auth/forgot-password',
        'api/v1/auth/reset-password',
        'api/v1/auth/verify-email',
        'api/v1/auth/verify-reset-code',
        'api/v1/auth/resend-verification',
    ];
}
