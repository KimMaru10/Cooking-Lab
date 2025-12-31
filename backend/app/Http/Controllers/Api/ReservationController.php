<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Models\Schedule;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $reservations = Reservation::with(['schedule.lesson', 'schedule.instructor'])
            ->where('user_id', $request->user()->id)
            ->latest('reserved_at')
            ->paginate(10);

        return ReservationResource::collection($reservations);
    }

    public function adminIndex(Request $request): AnonymousResourceCollection
    {
        $query = Reservation::with(['user', 'schedule.lesson', 'schedule.instructor']);

        if ($request->has('schedule_id')) {
            $query->where('schedule_id', $request->schedule_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reservations = $query->latest('reserved_at')->paginate(20);

        return ReservationResource::collection($reservations);
    }

    public function store(StoreReservationRequest $request): JsonResponse
    {
        $user = $request->user();
        $scheduleId = $request->schedule_id;

        // 重複予約チェック
        $existingReservation = Reservation::where('user_id', $user->id)
            ->where('schedule_id', $scheduleId)
            ->where('status', 'reserved')
            ->exists();

        if ($existingReservation) {
            return response()->json([
                'message' => 'このスケジュールは既に予約済みです',
            ], 422);
        }

        // スケジュール取得・空き確認
        $schedule = Schedule::findOrFail($scheduleId);

        if ($schedule->isFull()) {
            return response()->json([
                'message' => 'このスケジュールは満席です',
            ], 422);
        }

        // 有効なチケット取得
        $ticket = Ticket::where('user_id', $user->id)
            ->where('remaining_count', '>', 0)
            ->where('expires_at', '>', now())
            ->oldest('expires_at')
            ->first();

        if (!$ticket) {
            return response()->json([
                'message' => '有効なチケットがありません',
            ], 422);
        }

        // トランザクションで予約作成
        $reservation = DB::transaction(function () use ($user, $schedule, $ticket) {
            // 予約作成
            $reservation = Reservation::create([
                'user_id' => $user->id,
                'schedule_id' => $schedule->id,
                'ticket_id' => $ticket->id,
                'status' => 'reserved',
                'reserved_at' => now(),
            ]);

            // チケット残数を減らす
            $ticket->decrement('remaining_count');

            // スケジュールの予約数を増やす
            $schedule->increment('reservation_count');

            return $reservation;
        });

        return response()->json([
            'message' => '予約が完了しました',
            'reservation' => new ReservationResource($reservation->load(['schedule.lesson', 'schedule.instructor'])),
        ], 201);
    }

    public function destroy(Reservation $reservation): JsonResponse
    {
        $user = request()->user();

        // 自分の予約かチェック（スタッフは除く）
        if ($reservation->user_id !== $user->id && !$user->isStaff()) {
            return response()->json([
                'message' => 'この予約をキャンセルする権限がありません',
            ], 403);
        }

        // 既にキャンセル済みかチェック
        if ($reservation->status === 'cancelled') {
            return response()->json([
                'message' => 'この予約は既にキャンセルされています',
            ], 422);
        }

        // トランザクションでキャンセル処理
        DB::transaction(function () use ($reservation) {
            // 予約ステータス更新
            $reservation->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            // チケット残数を戻す
            $reservation->ticket->increment('remaining_count');

            // スケジュールの予約数を減らす
            $reservation->schedule->decrement('reservation_count');
        });

        return response()->json([
            'message' => '予約をキャンセルしました',
        ]);
    }
}
