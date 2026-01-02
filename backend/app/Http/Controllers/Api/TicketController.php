<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TicketController extends Controller
{
    /**
     * 自分のチケット一覧
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $tickets = Ticket::where('user_id', $request->user()->id)
            ->latest('purchased_at')
            ->paginate(10);

        return TicketResource::collection($tickets);
    }

    /**
     * 全チケット一覧（スタッフ用）
     */
    public function adminIndex(Request $request): AnonymousResourceCollection
    {
        $query = Ticket::with('user');

        // ユーザーIDでフィルタ
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // プランでフィルタ
        if ($request->has('plan')) {
            $query->where('plan', $request->plan);
        }

        // 有効なチケットのみ
        if ($request->boolean('valid_only')) {
            $query->where('remaining_count', '>', 0)
                ->where('expires_at', '>', now());
        }

        $tickets = $query->latest('purchased_at')->paginate(20);

        return TicketResource::collection($tickets);
    }

    /**
     * チケット購入
     */
    public function store(StoreTicketRequest $request): JsonResponse
    {
        $plan = $request->plan;

        // プランに応じた回数を設定
        $remainingCount = match ($plan) {
            'single' => 1,
            'five' => 5,
            'ten' => 10,
            default => 1,
        };

        // 有効期限を設定（購入日から3ヶ月）
        $expiresAt = now()->addMonths(3);

        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'plan' => $plan,
            'remaining_count' => $remainingCount,
            'purchased_at' => now(),
            'expires_at' => $expiresAt,
        ]);

        return response()->json([
            'message' => 'チケットを購入しました',
            'ticket' => new TicketResource($ticket),
        ], 201);
    }

    /**
     * チケット詳細
     */
    public function show(Request $request, Ticket $ticket): JsonResponse
    {
        $user = $request->user();

        // 自分のチケットかスタッフのみ閲覧可能
        if ($ticket->user_id !== $user->id && !$user->isStaff()) {
            return response()->json([
                'message' => 'このチケットを閲覧する権限がありません',
            ], 403);
        }

        return response()->json([
            'ticket' => new TicketResource($ticket),
        ]);
    }
}
