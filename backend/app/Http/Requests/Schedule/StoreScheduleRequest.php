<?php

namespace App\Http\Requests\Schedule;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && ($user->isStaff() || $user->isInstructor());
    }

    public function rules(): array
    {
        return [
            'lesson_id' => ['required', 'exists:lessons,id'],
            'instructor_id' => ['required', 'exists:users,id'],
            'start_at' => ['required', 'date', 'after:now'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'capacity' => ['required', 'integer', 'min:1', 'max:20'],
            'status' => ['sometimes', Rule::in(['upcoming', 'cancelled', 'completed'])],
        ];
    }

    public function messages(): array
    {
        return [
            'lesson_id.required' => 'レッスンを選択してください',
            'lesson_id.exists' => '選択されたレッスンは存在しません',
            'instructor_id.required' => '講師を選択してください',
            'instructor_id.exists' => '選択された講師は存在しません',
            'start_at.required' => '開始日時を入力してください',
            'start_at.after' => '開始日時は現在より後の日時を指定してください',
            'end_at.required' => '終了日時を入力してください',
            'end_at.after' => '終了日時は開始日時より後を指定してください',
            'capacity.required' => '定員を入力してください',
            'capacity.min' => '定員は1以上で入力してください',
            'capacity.max' => '定員は20以下で入力してください',
        ];
    }
}
