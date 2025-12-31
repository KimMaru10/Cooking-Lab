<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'schedule_id' => $this->schedule_id,
            'schedule' => new ScheduleResource($this->whenLoaded('schedule')),
            'ticket_id' => $this->ticket_id,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'reserved_at' => $this->reserved_at,
            'cancelled_at' => $this->cancelled_at,
            'created_at' => $this->created_at,
        ];
    }

    private function getStatusLabel(): string
    {
        return match ($this->status) {
            'reserved' => '予約中',
            'cancelled' => 'キャンセル',
            'attended' => '参加済み',
            'absent' => '欠席',
            default => $this->status,
        };
    }
}
