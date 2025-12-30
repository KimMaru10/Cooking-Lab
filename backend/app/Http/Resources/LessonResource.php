<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'category_label' => $this->getCategoryLabel(),
            'difficulty' => $this->difficulty,
            'difficulty_label' => $this->getDifficultyLabel(),
            'schedules' => ScheduleResource::collection($this->whenLoaded('schedules')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function getCategoryLabel(): string
    {
        return match ($this->category) {
            'japanese' => '和食',
            'western' => '洋食',
            'chinese' => '中華',
            'sweets' => 'スイーツ',
            default => $this->category,
        };
    }

    private function getDifficultyLabel(): string
    {
        return match ($this->difficulty) {
            'beginner' => '初級',
            'intermediate' => '中級',
            'advanced' => '上級',
            default => $this->difficulty,
        };
    }
}
