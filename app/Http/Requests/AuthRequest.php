<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * @return bool
     */
    public function authorize(): bool
    {
        return true; // Cho phép tất cả users truy cập auth endpoints
    }

    /**
     * Get the validation rules that apply to the request.
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
}
