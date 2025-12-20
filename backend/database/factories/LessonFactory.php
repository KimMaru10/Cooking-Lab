<?php

namespace Database\Factories;

use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition(): array
    {
        $categories = ['japanese', 'western', 'chinese', 'sweets'];
        $difficulties = ['beginner', 'intermediate', 'advanced'];

        return [
            'title' => fake()->randomElement([
                '基本の出汁の取り方',
                'パスタの基本',
                '本格中華炒め',
                'フレンチの基礎',
                '和菓子入門',
                '魚のさばき方',
                'パン作り基礎',
                'ケーキデコレーション',
            ]),
            'description' => fake()->realText(200),
            'category' => fake()->randomElement($categories),
            'difficulty' => fake()->randomElement($difficulties),
        ];
    }

    public function beginner(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'beginner',
        ]);
    }

    public function intermediate(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'intermediate',
        ]);
    }

    public function advanced(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'advanced',
        ]);
    }
}
