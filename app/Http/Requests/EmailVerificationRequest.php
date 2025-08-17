<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailVerificationRequest extends FormRequest
{
    /**
     * Kiểm tra xem user có quyền truy cập endpoint này không
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Lấy các quy tắc validation
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->is('api/send-verification-code')) {
            return [
                'email' => 'required|email',
            ];
        }
        if ($this->is('api/verify-email-with-registration')) {
            return [
                'email' => 'required|email',
                'verification_code' => 'required|string|size:6|regex:/^[0-9]+$/',
                'registration_data' => 'nullable|array'
            ];
        }
        return [];
    }

    /**
     * Lấy các thông báo lỗi
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không đúng định dạng.',
            'verification_code.required' => 'Mã xác thực là bắt buộc.',
            'verification_code.size' => 'Mã xác thực phải có đúng 6 chữ số.',
            'verification_code.regex' => 'Mã xác thực chỉ được chứa chữ số.',
        ];
    }
}
