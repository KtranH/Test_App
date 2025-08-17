<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    /**
     * Kiểm tra xem user có quyền truy cập endpoint này không
     * @return bool
     */
    public function authorize(): bool
    {
        return true; // Cho phép tất cả users truy cập auth endpoints
    }

    /**
     * Lấy các quy tắc validation
     * @return array
     */
    public function rules(): array
    {
        if ($this->is('api/register')) {
            return [
                'name' => 'required|string|min:6|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
            ];
        }
        
        if ($this->is('api/login')) {
            return [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
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
            'name.required' => 'Tên là bắt buộc',
            'name.string' => 'Tên phải là chuỗi',
            'name.min' => 'Tên phải có ít nhất 6 ký tự',
            'name.max' => 'Tên không được vượt quá 255 ký tự',
        ];
    }
}
