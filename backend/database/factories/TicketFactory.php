<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        $plan = fake()->randomElement(['single', 'five', 'ten']);
        $remainingCount = match ($plan) {
            'single' => 1,
            'five' => fake()->numberBetween(1, 5),
            'ten' => fake()->numberBetween(1, 10),
        };

        return [
            'user_id' => User::factory()->student(),
            'plan' => $plan,
            'remaining_count' => $remainingCount,
            'purchased_at' => now(),
            'expires_at' => now()->addMonths(3),
        ];
    }

    public function single(): static
    {
        return $this->state(fn (array $attributes) => [
            'plan' => 'single',
            'remaining_count' => 1,
        ]);
    }

    public function five(): static
    {
        return $this->state(fn (array $attributes) => [
            'plan' => 'five',
            'remaining_count' => 5,
        ]);
    }

    public function ten(): static
    {
        return $this->state(fn (array $attributes) => [
            'plan' => 'ten',
            'remaining_count' => 10,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subDay(),
        ]);
    }

    public function used(): static
    {
        return $this->state(fn (array $attributes) => [
            'remaining_count' => 0,
        ]);
    }
}
