<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Schedule\StoreScheduleRequest;
use App\Http\Requests\Schedule\UpdateScheduleRequest;
use App\Http\Resources\ScheduleResource;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ScheduleController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Schedule::with(['lesson', 'instructor']);

        // レッスンでフィルタ
        if ($request->has('lesson_id')) {
            $query->where('lesson_id', $request->lesson_id);
        }

        // 日付でフィルタ
        if ($request->has('date')) {
            $query->whereDate('start_at', $request->date);
        }

        // 期間でフィルタ
        if ($request->has('from')) {
            $query->where('start_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->where('start_at', '<=', $request->to);
        }

        // ステータスでフィルタ
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // 空きありのみ
        if ($request->boolean('available')) {
            $query->whereColumn('reservation_count', '<', 'capacity');
        }

        $schedules = $query->orderBy('start_at')->paginate(20);

        return ScheduleResource::collection($schedules);
    }

    public function show(Schedule $schedule): ScheduleResource
    {
        return new ScheduleResource($schedule->load(['lesson', 'instructor', 'reservations']));
    }

    public function store(StoreScheduleRequest $request): JsonResponse
    {
        $schedule = Schedule::create($request->validated());

        return response()->json([
            'message' => 'スケジュールを作成しました',
            'schedule' => new ScheduleResource($schedule->load(['lesson', 'instructor'])),
        ], 201);
    }

    public function update(UpdateScheduleRequest $request, Schedule $schedule): JsonResponse
    {
        $schedule->update($request->validated());

        return response()->json([
            'message' => 'スケジュールを更新しました',
            'schedule' => new ScheduleResource($schedule->load(['lesson', 'instructor'])),
        ]);
    }

    public function destroy(Schedule $schedule): JsonResponse
    {
        if ($schedule->reservation_count > 0) {
            return response()->json([
                'message' => '予約があるスケジュールは削除できません',
            ], 422);
        }

        $schedule->delete();

        return response()->json([
            'message' => 'スケジュールを削除しました',
        ]);
    }
}
