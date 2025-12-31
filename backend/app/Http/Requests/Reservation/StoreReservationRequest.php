<?php

namespace App\Http\Requests\Reservation;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isStudent();
    }

    public function rules(): array
    {
        return [
            'schedule_id' => ['required', 'exists:schedules,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'schedule_id.required' => 'スケジュールを選択してください',
            'schedule_id.exists' => '選択されたスケジュールは存在しません',
        ];
    }
}
