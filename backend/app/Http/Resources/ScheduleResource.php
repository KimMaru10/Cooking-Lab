<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'lesson_id' => $this->lesson_id,
            'instructor_id' => $this->instructor_id,
            'instructor' => new UserResource($this->whenLoaded('instructor')),
            'start_at' => $this->start_at,
            'end_at' => $this->end_at,
            'capacity' => $this->capacity,
            'reservation_count' => $this->reservation_count,
            'available_count' => $this->capacity - $this->reservation_count,
            'is_full' => $this->reservation_count >= $this->capacity,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
