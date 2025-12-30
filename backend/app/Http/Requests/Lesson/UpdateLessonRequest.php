<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isStaff();
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:100'],
            'description' => ['sometimes', 'string'],
            'category' => ['sometimes', Rule::in(['japanese', 'western', 'chinese', 'sweets'])],
            'difficulty' => ['sometimes', Rule::in(['beginner', 'intermediate', 'advanced'])],
        ];
    }

    public function messages(): array
    {
        return [
            'title.max' => 'タイトルは100文字以内で入力してください',
            'category.in' => '無効なカテゴリです',
            'difficulty.in' => '無効な難易度です',
        ];
    }
}
