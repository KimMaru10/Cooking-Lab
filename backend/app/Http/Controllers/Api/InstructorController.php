<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InstructorController extends Controller
{
    /**
     * 講師の担当スケジュール一覧を取得
     */
    public function schedules(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isInstructor()) {
            return response()->json([
                'message' => '講師権限が必要です',
            ], 403);
        }

        $schedules = Schedule::with(['lesson', 'reservations.user'])
            ->where('instructor_id', $user->id)
            ->orderBy('start_at', 'asc')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'lesson' => [
                        'id' => $schedule->lesson->id,
                        'title' => $schedule->lesson->title,
                        'category' => $schedule->lesson->category,
                        'category_label' => $this->getCategoryLabel($schedule->lesson->category),
                    ],
                    'start_at' => $schedule->start_at->format('Y-m-d H:i'),
                    'end_at' => $schedule->end_at->format('Y-m-d H:i'),
                    'capacity' => $schedule->capacity,
                    'reservation_count' => $schedule->reservation_count,
                    'status' => $schedule->status,
                    'status_label' => $this->getStatusLabel($schedule->status),
                    'can_start' => $this->canStartLesson($schedule),
                    'reservations' => $schedule->reservations
                        ->where('status', '!=', 'cancelled')
                        ->map(function ($reservation) {
                            return [
                                'id' => $reservation->id,
                                'user' => [
                                    'id' => $reservation->user->id,
                                    'name' => $reservation->user->name,
                                ],
                                'status' => $reservation->status,
                                'status_label' => $this->getReservationStatusLabel($reservation->status),
                            ];
                        })->values(),
                ];
            });

        return response()->json([
            'schedules' => $schedules,
        ]);
    }

    /**
     * レッスンを開始する
     */
    public function startLesson(Request $request, int $scheduleId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isInstructor()) {
            return response()->json([
                'message' => '講師権限が必要です',
            ], 403);
        }

        $schedule = Schedule::where('instructor_id', $user->id)
            ->where('id', $scheduleId)
            ->first();

        if (!$schedule) {
            return response()->json([
                'message' => 'スケジュールが見つかりません',
            ], 404);
        }

        if ($schedule->status !== 'upcoming') {
            return response()->json([
                'message' => 'このレッスンは開始できません',
            ], 400);
        }

        if (!$this->canStartLesson($schedule)) {
            return response()->json([
                'message' => '開始時刻の30分前から開始できます',
            ], 400);
        }

        $schedule->update(['status' => 'in_progress']);

        return response()->json([
            'message' => 'レッスンを開始しました',
            'schedule' => [
                'id' => $schedule->id,
                'status' => $schedule->status,
            ],
        ]);
    }

    /**
     * 出席を記録する
     */
    public function markAttendance(Request $request, int $scheduleId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isInstructor()) {
            return response()->json([
                'message' => '講師権限が必要です',
            ], 403);
        }

        $request->validate([
            'attendances' => 'required|array',
            'attendances.*.reservation_id' => 'required|integer',
            'attendances.*.attended' => 'required|boolean',
        ]);

        $schedule = Schedule::where('instructor_id', $user->id)
            ->where('id', $scheduleId)
            ->first();

        if (!$schedule) {
            return response()->json([
                'message' => 'スケジュールが見つかりません',
            ], 404);
        }

        if ($schedule->status !== 'in_progress') {
            return response()->json([
                'message' => 'レッスン開始後に出席を記録できます',
            ], 400);
        }

        DB::transaction(function () use ($request, $schedule) {
            foreach ($request->attendances as $attendance) {
                $reservation = Reservation::where('id', $attendance['reservation_id'])
                    ->where('schedule_id', $schedule->id)
                    ->where('status', 'reserved')
                    ->first();

                if ($reservation) {
                    $newStatus = $attendance['attended'] ? 'attended' : 'absent';
                    $reservation->update(['status' => $newStatus]);

                    // 無断欠席の場合、ペナルティポイントを加算
                    if (!$attendance['attended']) {
                        $student = $reservation->user;
                        $student->increment('penalty_point');

                        // ペナルティが3点に達したら1ヶ月停止
                        if ($student->penalty_point >= 3) {
                            $student->update([
                                'suspended_until' => Carbon::now()->addMonth(),
                            ]);
                        }
                    }
                }
            }

            // 全員の出席を記録したらレッスン完了
            $pendingReservations = Reservation::where('schedule_id', $schedule->id)
                ->where('status', 'reserved')
                ->count();

            if ($pendingReservations === 0) {
                $schedule->update(['status' => 'completed']);
            }
        });

        return response()->json([
            'message' => '出席を記録しました',
        ]);
    }

    /**
     * レッスンを完了する
     */
    public function completeLesson(Request $request, int $scheduleId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isInstructor()) {
            return response()->json([
                'message' => '講師権限が必要です',
            ], 403);
        }

        $schedule = Schedule::where('instructor_id', $user->id)
            ->where('id', $scheduleId)
            ->first();

        if (!$schedule) {
            return response()->json([
                'message' => 'スケジュールが見つかりません',
            ], 404);
        }

        if ($schedule->status !== 'in_progress') {
            return response()->json([
                'message' => 'レッスン開始後に完了できます',
            ], 400);
        }

        // 未処理の予約を欠席扱いにする
        DB::transaction(function () use ($schedule) {
            $pendingReservations = Reservation::where('schedule_id', $schedule->id)
                ->where('status', 'reserved')
                ->get();

            foreach ($pendingReservations as $reservation) {
                $reservation->update(['status' => 'absent']);
                $student = $reservation->user;
                $student->increment('penalty_point');

                if ($student->penalty_point >= 3) {
                    $student->update([
                        'suspended_until' => Carbon::now()->addMonth(),
                    ]);
                }
            }

            $schedule->update(['status' => 'completed']);
        });

        return response()->json([
            'message' => 'レッスンを完了しました',
        ]);
    }

    private function canStartLesson(Schedule $schedule): bool
    {
        if ($schedule->status !== 'upcoming') {
            return false;
        }

        // 開始30分前から開始可能
        $startTime = $schedule->start_at;
        $now = Carbon::now();

        return $now->gte($startTime->copy()->subMinutes(30));
    }

    private function getCategoryLabel(string $category): string
    {
        return match ($category) {
            'japanese' => '和食',
            'western' => '洋食',
            'chinese' => '中華',
            'sweets' => 'スイーツ',
            default => $category,
        };
    }

    private function getStatusLabel(string $status): string
    {
        return match ($status) {
            'upcoming' => '開催予定',
            'in_progress' => '開催中',
            'completed' => '完了',
            'cancelled' => 'キャンセル',
            default => $status,
        };
    }

    private function getReservationStatusLabel(string $status): string
    {
        return match ($status) {
            'reserved' => '予約中',
            'cancelled' => 'キャンセル',
            'attended' => '出席',
            'absent' => '欠席',
            default => $status,
        };
    }
}
