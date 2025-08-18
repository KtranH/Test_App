<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TwoFaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->route()->getName() === 'two-factor.verify-login') {
            return [
                'otp' => 'required|string',
                'challenge_id' => 'required|string',
            ];
        }
        
        return [
            'otp' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'otp.required' => 'Mã OTP là bắt buộc',
            'challenge_id.required' => 'Challenge ID là bắt buộc',
        ];
    }
}