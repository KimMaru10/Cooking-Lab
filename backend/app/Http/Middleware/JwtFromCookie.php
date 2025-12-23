<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtFromCookie
{
    public function handle(Request $request, Closure $next): Response
    {
        // Cookieからアクセストークンを取得してAuthorizationヘッダーに設定
        $accessToken = $request->cookie('access_token');

        if ($accessToken && !$request->hasHeader('Authorization')) {
            $request->headers->set('Authorization', 'Bearer ' . $accessToken);
        }

        // セッションとの整合性チェック
        $refreshToken = $request->cookie('refresh_token');
        $sessionTokenId = session('token_id');

        if ($refreshToken && $sessionTokenId) {
            $tokenPrefix = substr($refreshToken, 0, 8);
            $expectedPrefix = explode(':', $sessionTokenId)[1] ?? '';

            if ($tokenPrefix !== $expectedPrefix) {
                return response()->json([
                    'message' => 'セッションが無効です。再度ログインしてください。',
                ], 401);
            }
        }

        return $next($request);
    }
}
