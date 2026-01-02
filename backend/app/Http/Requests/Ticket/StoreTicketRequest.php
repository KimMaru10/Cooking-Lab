<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isStudent();
    }

    public function rules(): array
    {
        return [
            'plan' => ['required', Rule::in(['single', 'five', 'ten'])],
        ];
    }

    public function messages(): array
    {
        return [
            'plan.required' => 'プランを選択してください',
            'plan.in' => '無効なプランです',
        ];
    }
}
