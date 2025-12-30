<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isStaff();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'category' => ['required', Rule::in(['japanese', 'western', 'chinese', 'sweets'])],
            'difficulty' => ['required', Rule::in(['beginner', 'intermediate', 'advanced'])],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タイトルを入力してください',
            'title.max' => 'タイトルは100文字以内で入力してください',
            'description.required' => '説明を入力してください',
            'category.required' => 'カテゴリを選択してください',
            'category.in' => '無効なカテゴリです',
            'difficulty.required' => '難易度を選択してください',
            'difficulty.in' => '無効な難易度です',
        ];
    }
}
