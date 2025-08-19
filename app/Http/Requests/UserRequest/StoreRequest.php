<?php

namespace App\Http\Requests\UserRequest;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    
    public function rules(): array
    {
        return [
            'name'     => 'required|string|min:6|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role'     => 'required|string|in:user,super_admin,admin',
            'status'   => 'required|string|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên là bắt buộc',
            'name.string' => 'Tên phải là chuỗi',
            'name.min' => 'Tên phải có ít nhất 6 ký tự',
            'name.max' => 'Tên không được vượt quá 255 ký tự',
            'email.required' => 'Email là bắt buộc',
            'email.email' => 'Email không hợp lệ',
            'email.unique' => 'Email đã tồn tại',
            'password.required' => 'Mật khẩu là bắt buộc',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'role.required' => 'Role là bắt buộc',
            'role.string' => 'Role phải là chuỗi',
            'role.in' => 'Role phải là user, super_admin hoặc admin',
            'status.required' => 'Status là bắt buộc',
            'status.string' => 'Status phải là chuỗi',
            'status.in' => 'Status phải là active hoặc inactive',
        ];
    }
}