<?php

namespace App\Http\Requests\TaskRequest;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string|in:pending,in_progress,completed,cancelled',
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Tên là bắt buộc',
            'name.string' => 'Tên phải là chuỗi',
            'name.max' => 'Tên không được vượt quá 255 ký tự',
            'description.required' => 'Mô tả là bắt buộc',
            'description.string' => 'Mô tả phải là chuỗi',
            'status.required' => 'Trạng thái là bắt buộc',
            'status.string' => 'Trạng thái phải là chuỗi',
            'status.in' => 'Trạng thái phải là pending, in_progress, completed hoặc cancelled',
            'user_id.required' => 'User là bắt buộc',
            'user_id.exists' => 'User không tồn tại',
            'start_date.required' => 'Ngày bắt đầu là bắt buộc',
            'start_date.date' => 'Ngày bắt đầu phải là ngày',
            'end_date.required' => 'Ngày kết thúc là bắt buộc',
            'end_date.date' => 'Ngày kết thúc phải là ngày',
        ];
    }
}