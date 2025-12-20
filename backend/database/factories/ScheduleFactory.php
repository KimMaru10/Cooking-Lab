<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;

    public function definition(): array
    {
        $startAt = fake()->dateTimeBetween('now', '+1 month');
        $endAt = (clone $startAt)->modify('+2 hours');

        return [
            'lesson_id' => Lesson::factory(),
            'instructor_id' => User::factory()->instructor(),
            'start_at' => $startAt,
            'end_at' => $endAt,
            'capacity' => 6,
            'reservation_count' => 0,
            'status' => 'upcoming',
        ];
    }

    public function full(): static
    {
        return $this->state(fn (array $attributes) => [
            'reservation_count' => $attributes['capacity'] ?? 6,
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'start_at' => fake()->dateTimeBetween('-1 month', '-1 day'),
            'end_at' => fake()->dateTimeBetween('-1 month', '-1 day'),
        ]);
    }
}
