<?php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\Schedule;
use App\Models\Ticket;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();
        $schedules = Schedule::where('status', 'upcoming')->get();

        if ($students->isEmpty() || $schedules->isEmpty()) {
            return;
        }

        $reservationCount = 0;
        $maxReservations = 30;

        foreach ($schedules as $schedule) {
            if ($reservationCount >= $maxReservations) {
                break;
            }

            // 各スケジュールに0〜3件の予約を作成
            $numReservations = min(rand(0, 3), $maxReservations - $reservationCount);
            $usedStudentIds = [];

            for ($i = 0; $i < $numReservations; $i++) {
                $student = $students->whereNotIn('id', $usedStudentIds)->random();
                if (!$student) {
                    continue;
                }

                $usedStudentIds[] = $student->id;

                // 生徒の有効なチケットを取得
                $ticket = Ticket::where('user_id', $student->id)
                    ->where('remaining_count', '>', 0)
                    ->where('expires_at', '>', now())
                    ->first();

                if (!$ticket) {
                    continue;
                }

                Reservation::create([
                    'user_id' => $student->id,
                    'schedule_id' => $schedule->id,
                    'ticket_id' => $ticket->id,
                    'status' => 'reserved',
                    'reserved_at' => Carbon::now()->subDays(rand(1, 7)),
                    'cancelled_at' => null,
                ]);

                // チケットの残数を減らす
                $ticket->decrement('remaining_count');

                // スケジュールの予約数を増やす
                $schedule->increment('reservation_count');

                $reservationCount++;
            }
        }
    }
}
