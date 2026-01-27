<?php

namespace Tests\Feature\Api;

use App\Models\Lesson;
use App\Models\Reservation;
use App\Models\Schedule;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    private User $student;
    private Schedule $schedule;

    protected function setUp(): void
    {
        parent::setUp();

        $this->student = User::factory()->student()->create();
        $instructor = User::factory()->instructor()->create();
        $lesson = Lesson::factory()->create();
        $this->schedule = Schedule::factory()->create([
            'lesson_id' => $lesson->id,
            'instructor_id' => $instructor->id,
            'capacity' => 8,
            'reservation_count' => 0,
        ]);
    }

    public function test_user_can_make_reservation_with_valid_ticket(): void
    {
        Ticket::factory()->create([
            'user_id' => $this->student->id,
            'remaining_count' => 3,
            'expires_at' => now()->addMonths(6),
        ]);

        $response = $this->actingAs($this->student)
            ->postJson('/api/reservations', [
                'schedule_id' => $this->schedule->id,
            ]);

        $response->assertStatus(201)
            ->assertJson(['message' => '予約が完了しました']);

        $this->assertDatabaseHas('reservations', [
            'user_id' => $this->student->id,
            'schedule_id' => $this->schedule->id,
            'status' => 'reserved',
        ]);
    }

    public function test_reservation_consumes_oldest_ticket_first(): void
    {
        // 新しいチケット
        $newTicket = Ticket::factory()->create([
            'user_id' => $this->student->id,
            'remaining_count' => 5,
            'expires_at' => now()->addMonths(6),
        ]);

        // 古いチケット（有効期限が近い）
        $oldTicket = Ticket::factory()->create([
            'user_id' => $this->student->id,
            'remaining_count' => 2,
            'expires_at' => now()->addMonth(),
        ]);

        $this->actingAs($this->student)
            ->postJson('/api/reservations', [
                'schedule_id' => $this->schedule->id,
            ]);

        // 有効期限が近い古いチケットが消費される（FIFO）
        $this->assertEquals(1, $oldTicket->fresh()->remaining_count);
        $this->assertEquals(5, $newTicket->fresh()->remaining_count);
    }

    public function test_user_cannot_reserve_without_valid_ticket(): void
    {
        $response = $this->actingAs($this->student)
            ->postJson('/api/reservations', [
                'schedule_id' => $this->schedule->id,
            ]);

        $response->assertStatus(422)
            ->assertJson(['message' => '有効なチケットがありません']);
    }

    public function test_user_cannot_reserve_with_expired_ticket(): void
    {
        Ticket::factory()->create([
            'user_id' => $this->student->id,
            'remaining_count' => 3,
            'expires_at' => now()->subDay(),
        ]);

        $response = $this->actingAs($this->student)
            ->postJson('/api/reservations', [
                'schedule_id' => $this->schedule->id,
            ]);

        $response->assertStatus(422)
            ->assertJson(['message' => '有効なチケットがありません']);
    }

    public function test_user_cannot_make_duplicate_reservation(): void
    {
        Ticket::factory()->create([
            'user_id' => $this->student->id,
            'remaining_count' => 3,
            'expires_at' => now()->addMonths(6),
        ]);

        // 最初の予約
        $this->actingAs($this->student)
            ->postJson('/api/reservations', [
                'schedule_id' => $this->schedule->id,
            ]);

        // 重複予約
        $response = $this->actingAs($this->student)
            ->postJson('/api/reservations', [
                'schedule_id' => $this->schedule->id,
            ]);

        $response->assertStatus(422)
            ->assertJson(['message' => 'このスケジュールは既に予約済みです']);
    }

    public function test_user_cannot_reserve_when_schedule_is_full(): void
    {
        $this->schedule->update([
            'capacity' => 1,
            'reservation_count' => 1,
        ]);

        Ticket::factory()->create([
            'user_id' => $this->student->id,
            'remaining_count' => 3,
            'expires_at' => now()->addMonths(6),
        ]);

        $response = $this->actingAs($this->student)
            ->postJson('/api/reservations', [
                'schedule_id' => $this->schedule->id,
            ]);

        $response->assertStatus(422)
            ->assertJson(['message' => 'このスケジュールは満席です']);
    }

    public function test_user_can_cancel_reservation_before_24_hours(): void
    {
        $ticket = Ticket::factory()->create([
            'user_id' => $this->student->id,
            'remaining_count' => 2,
            'expires_at' => now()->addMonths(6),
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $this->student->id,
            'schedule_id' => $this->schedule->id,
            'ticket_id' => $ticket->id,
            'status' => 'reserved',
        ]);

        $this->schedule->update([
            'start_at' => now()->addDays(2),
            'reservation_count' => 1,
        ]);

        $response = $this->actingAs($this->student)
            ->deleteJson("/api/reservations/{$reservation->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => '予約をキャンセルしました']);

        $this->assertEquals('cancelled', $reservation->fresh()->status);
        $this->assertEquals(3, $ticket->fresh()->remaining_count);
    }
}
