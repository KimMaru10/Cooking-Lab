<?php

namespace App\Http\Requests\Schedule;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && ($user->isStaff() || $user->isInstructor());
    }

    public function rules(): array
    {
        return [
            'lesson_id' => ['sometimes', 'exists:lessons,id'],
            'instructor_id' => ['sometimes', 'exists:users,id'],
            'start_at' => ['sometimes', 'date'],
            'end_at' => ['sometimes', 'date', 'after:start_at'],
            'capacity' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'status' => ['sometimes', Rule::in(['upcoming', 'cancelled', 'completed'])],
        ];
    }

    public function messages(): array
    {
        return [
            'lesson_id.exists' => '選択されたレッスンは存在しません',
            'instructor_id.exists' => '選択された講師は存在しません',
            'end_at.after' => '終了日時は開始日時より後を指定してください',
            'capacity.min' => '定員は1以上で入力してください',
            'capacity.max' => '定員は20以下で入力してください',
        ];
    }
}
