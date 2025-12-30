<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->when($this->shouldShowEmail($request), $this->email),
            'role' => $this->role,
        ];
    }

    private function shouldShowEmail(Request $request): bool
    {
        $user = $request->user();
        if (!$user) {
            return false;
        }
        return $user->id === $this->id || $user->isStaff();
    }
}
