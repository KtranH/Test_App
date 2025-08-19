<?php 

namespace App\Http\Requests\TaskRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;

class StoreRequest extends FormRequest
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
            'user_id' => 'required|integer|exists:users,id',
            'start_date' => 'required|date|after_or_equal:today',
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
            'user_id.required' => 'Vui lòng chọn người dùng từ gợi ý',
            'user_id.integer' => 'Định danh người dùng không hợp lệ',
            'user_id.exists' => 'Người dùng không tồn tại',
            'start_date.required' => 'Ngày bắt đầu là bắt buộc',
            'start_date.date' => 'Ngày bắt đầu phải là ngày',
            'start_date.after_or_equal' => 'Ngày bắt đầu phải là ngày hiện tại hoặc sau đó',
            'end_date.required' => 'Ngày kết thúc là bắt buộc',
            'end_date.date' => 'Ngày kết thúc phải là ngày',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $start = $this->input('start_date');
            $end = $this->input('end_date');
            try {
                $startDate = Carbon::parse($start)->toDateString();
                $endDate = Carbon::parse($end)->toDateString();
                if ($startDate > $endDate) {
                    $validator->errors()->add('start_date', 'Ngày bắt đầu không được sau ngày kết thúc');
                }
            } catch (\Throwable $e) {
                // bỏ qua, validator date đã bắt
            }
        });
    }
}