<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Cho phép tất cả users truy cập auth endpoints
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        if ($this->is('api/v1/auth/register')) {
            return [
                'name' => 'required|string|min:6|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
            ];
        }
        
        if ($this->is('api/v1/auth/login')) {
            return [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ];
        }
        
        return [];
    }
}
