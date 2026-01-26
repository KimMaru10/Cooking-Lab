<?php

namespace Tests\Feature\Api;

use App\Models\Lesson;
use App\Models\Schedule;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PenaltyTest extends TestCase
{
    use RefreshDatabase;

    public function test_suspended_user_cannot_make_reservation(): void
    {
        $student = User::factory()->student()->create([
            'penalty_point' => 3,
            'suspended_until' => now()->addMonth(),
        ]);

        $instructor = User::factory()->instructor()->create();
        $lesson = Lesson::factory()->create();
        $schedule = Schedule::factory()->create([
            'lesson_id' => $lesson->id,
            'instructor_id' => $instructor->id,
        ]);

        Ticket::factory()->create([
            'user_id' => $student->id,
            'remaining_count' => 3,
            'expires_at' => now()->addMonths(6),
        ]);

        $response = $this->actingAs($student)
            ->postJson('/api/reservations', [
                'schedule_id' => $schedule->id,
            ]);

        $response->assertStatus(403)
            ->assertJson(['message' => 'ペナルティにより予約が停止されています']);
    }

    public function test_user_can_reserve_after_suspension_ends(): void
    {
        $student = User::factory()->student()->create([
            'penalty_point' => 3,
            'suspended_until' => now()->subDay(),
        ]);

        $instructor = User::factory()->instructor()->create();
        $lesson = Lesson::factory()->create();
        $schedule = Schedule::factory()->create([
            'lesson_id' => $lesson->id,
            'instructor_id' => $instructor->id,
            'capacity' => 8,
            'reservation_count' => 0,
        ]);

        Ticket::factory()->create([
            'user_id' => $student->id,
            'remaining_count' => 3,
            'expires_at' => now()->addMonths(6),
        ]);

        $response = $this->actingAs($student)
            ->postJson('/api/reservations', [
                'schedule_id' => $schedule->id,
            ]);

        $response->assertStatus(201)
            ->assertJson(['message' => '予約が完了しました']);
    }

    public function test_user_with_penalty_but_not_suspended_can_reserve(): void
    {
        $student = User::factory()->student()->create([
            'penalty_point' => 2,
            'suspended_until' => null,
        ]);

        $instructor = User::factory()->instructor()->create();
        $lesson = Lesson::factory()->create();
        $schedule = Schedule::factory()->create([
            'lesson_id' => $lesson->id,
            'instructor_id' => $instructor->id,
            'capacity' => 8,
            'reservation_count' => 0,
        ]);

        Ticket::factory()->create([
            'user_id' => $student->id,
            'remaining_count' => 3,
            'expires_at' => now()->addMonths(6),
        ]);

        $response = $this->actingAs($student)
            ->postJson('/api/reservations', [
                'schedule_id' => $schedule->id,
            ]);

        $response->assertStatus(201)
            ->assertJson(['message' => '予約が完了しました']);
    }
}
