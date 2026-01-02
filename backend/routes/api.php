<?php

use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Middleware\CheckRole;
use App\Http\Middleware\JwtFromCookie;
use Illuminate\Support\Facades\Route;

// 認証不要
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});

// レッスン（認証不要：一覧・詳細）
Route::prefix('lessons')->group(function () {
    Route::get('/', [LessonController::class, 'index']);
    Route::get('/{lesson}', [LessonController::class, 'show']);
});

// スケジュール（認証不要：一覧・詳細）
Route::prefix('schedules')->group(function () {
    Route::get('/', [ScheduleController::class, 'index']);
    Route::get('/{schedule}', [ScheduleController::class, 'show']);
});

// 認証必要（JWT + Cookie）
Route::middleware([JwtFromCookie::class, 'auth:api'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // 予約（生徒）
    Route::prefix('reservations')->group(function () {
        Route::get('/', [ReservationController::class, 'index']);
        Route::post('/', [ReservationController::class, 'store']);
        Route::delete('/{reservation}', [ReservationController::class, 'destroy']);
    });

    // チケット
    Route::prefix('tickets')->group(function () {
        Route::get('/', [TicketController::class, 'index']);
        Route::post('/', [TicketController::class, 'store']);
        Route::get('/{ticket}', [TicketController::class, 'show']);
    });

    // レッスン管理（スタッフのみ）
    Route::middleware([CheckRole::class . ':staff'])->group(function () {
        Route::post('/lessons', [LessonController::class, 'store']);
        Route::put('/lessons/{lesson}', [LessonController::class, 'update']);
        Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy']);

        // 全予約一覧（スタッフ）
        Route::get('/admin/reservations', [ReservationController::class, 'adminIndex']);

        // 全チケット一覧（スタッフ）
        Route::get('/admin/tickets', [TicketController::class, 'adminIndex']);
    });

    // スケジュール管理（スタッフ・講師）
    Route::middleware([CheckRole::class . ':staff,instructor'])->group(function () {
        Route::post('/schedules', [ScheduleController::class, 'store']);
        Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);
        Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy']);
    });
});
