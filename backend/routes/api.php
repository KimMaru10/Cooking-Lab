<?php

use App\Http\Controllers\Api\LessonController;
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

// 認証必要（JWT + Cookie）
Route::middleware([JwtFromCookie::class, 'auth:api'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // レッスン管理（スタッフのみ）
    Route::middleware([CheckRole::class . ':staff'])->group(function () {
        Route::post('/lessons', [LessonController::class, 'store']);
        Route::put('/lessons/{lesson}', [LessonController::class, 'update']);
        Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy']);
    });
});
