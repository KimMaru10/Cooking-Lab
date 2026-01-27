<?php

namespace Tests\Unit\Models;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    public function test_is_expired_returns_true_when_past_expiry(): void
    {
        $ticket = Ticket::factory()->create([
            'expires_at' => now()->subDay(),
        ]);

        $this->assertTrue($ticket->isExpired());
    }

    public function test_is_expired_returns_false_when_not_expired(): void
    {
        $ticket = Ticket::factory()->create([
            'expires_at' => now()->addMonth(),
        ]);

        $this->assertFalse($ticket->isExpired());
    }

    public function test_is_valid_returns_true_when_not_expired_and_has_remaining(): void
    {
        $ticket = Ticket::factory()->create([
            'expires_at' => now()->addMonth(),
            'remaining_count' => 3,
        ]);

        $this->assertTrue($ticket->isValid());
    }

    public function test_is_valid_returns_false_when_expired(): void
    {
        $ticket = Ticket::factory()->create([
            'expires_at' => now()->subDay(),
            'remaining_count' => 3,
        ]);

        $this->assertFalse($ticket->isValid());
    }

    public function test_is_valid_returns_false_when_no_remaining_count(): void
    {
        $ticket = Ticket::factory()->create([
            'expires_at' => now()->addMonth(),
            'remaining_count' => 0,
        ]);

        $this->assertFalse($ticket->isValid());
    }
}
