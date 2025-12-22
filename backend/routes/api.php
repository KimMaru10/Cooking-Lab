<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Middleware\JwtFromCookie;
use Illuminate\Support\Facades\Route;

// 認証不要
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});

// 認証必要（JWT + Cookie）
Route::middleware([JwtFromCookie::class, 'auth:api'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});
