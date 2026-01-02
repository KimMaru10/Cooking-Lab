<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'plan' => $this->plan,
            'plan_label' => $this->getPlanLabel(),
            'remaining_count' => $this->remaining_count,
            'purchased_at' => $this->purchased_at,
            'expires_at' => $this->expires_at,
            'is_expired' => $this->isExpired(),
            'is_valid' => $this->isValid(),
            'created_at' => $this->created_at,
        ];
    }

    private function getPlanLabel(): string
    {
        return match ($this->plan) {
            'single' => '1回券',
            'five' => '5回券',
            'ten' => '10回券',
            default => $this->plan,
        };
    }
}
