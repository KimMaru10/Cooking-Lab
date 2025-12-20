<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();

        if ($students->isEmpty()) {
            return;
        }

        foreach ($students as $index => $student) {
            // 各生徒に1〜2枚のチケットを付与
            $ticketCount = rand(1, 2);

            for ($i = 0; $i < $ticketCount; $i++) {
                $plan = match ($index % 3) {
                    0 => 'single',
                    1 => 'five',
                    2 => 'ten',
                };

                $remainingCount = match ($plan) {
                    'single' => 1,
                    'five' => rand(1, 5),
                    'ten' => rand(1, 10),
                };

                Ticket::create([
                    'user_id' => $student->id,
                    'plan' => $plan,
                    'remaining_count' => $remainingCount,
                    'purchased_at' => Carbon::now()->subDays(rand(1, 30)),
                    'expires_at' => Carbon::now()->addMonths(3),
                ]);
            }
        }
    }
}
