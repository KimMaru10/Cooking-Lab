<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\Schedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $lessons = Lesson::all();
        $instructors = User::where('role', 'instructor')->get();

        if ($lessons->isEmpty() || $instructors->isEmpty()) {
            return;
        }

        $startDate = Carbon::now()->startOfWeek()->addWeek();

        // 今後4週間分のスケジュールを作成
        for ($week = 0; $week < 4; $week++) {
            foreach ($lessons as $index => $lesson) {
                $instructor = $instructors[$index % $instructors->count()];

                // 各レッスンを週に1回開催
                $dayOffset = $index % 5; // 月〜金
                $scheduleDate = $startDate->copy()->addWeeks($week)->addDays($dayOffset);

                Schedule::create([
                    'lesson_id' => $lesson->id,
                    'instructor_id' => $instructor->id,
                    'start_at' => $scheduleDate->copy()->setTime(10, 0),
                    'end_at' => $scheduleDate->copy()->setTime(12, 0),
                    'capacity' => 6,
                    'reservation_count' => rand(0, 4),
                    'status' => 'upcoming',
                ]);
            }
        }
    }
}
