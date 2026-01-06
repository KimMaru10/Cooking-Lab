<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    private const ACCESS_TOKEN_TTL = 15; // 15分
    private const REFRESH_TOKEN_TTL = 7 * 24 * 60; // 7日（分単位）

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student',
        ]);

        return $this->respondWithTokens($user, 'ユーザー登録が完了しました', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'メールアドレスまたはパスワードが正しくありません',
            ], 401);
        }

        if ($user->suspended_until && $user->suspended_until->isFuture()) {
            return response()->json([
                'message' => 'アカウントが停止されています',
                'suspended_until' => $user->suspended_until,
            ], 403);
        }

        return $this->respondWithTokens($user, 'ログインしました');
    }

    public function logout(Request $request): JsonResponse
    {
        // リフレッシュトークンを削除（認証状態に関わらず実行）
        $refreshToken = $request->cookie('refresh_token');
        if ($refreshToken) {
            RefreshToken::where('token', $refreshToken)->delete();
        }

        // JWTを無効化（トークンが存在する場合のみ）
        try {
            $token = JWTAuth::getToken();
            if ($token) {
                JWTAuth::invalidate($token);
            }
        } catch (\Exception $e) {
            // トークンが既に無効な場合や取得できない場合は無視
            // リフレッシュトークンとクッキーの削除は続行
        }

        // クッキーを削除（認証状態に関わらず実行）
        // 開発環境と本番環境で適切な設定を使用
        $domain = app()->environment('local') ? 'localhost' : null;
        $isSecure = app()->environment('production');
        $sameSite = app()->environment('local') ? false : 'Lax';

        $response = response()->json([
            'message' => 'ログアウトしました',
        ]);

        // クッキーを削除するために、元のクッキーと同じパラメータで削除クッキーを作成
        return $response
            ->withoutCookie(cookie(
                'access_token',
                null,
                -1,
                '/',
                $domain,
                $isSecure,
                true,
                false,
                $sameSite
            ))
            ->withoutCookie(cookie(
                'refresh_token',
                null,
                -1,
                '/',
                $domain,
                $isSecure,
                true,
                false,
                $sameSite
            ));
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => auth()->user(),
        ]);
    }

    public function refresh(Request $request): JsonResponse
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json([
                'message' => 'リフレッシュトークンがありません',
            ], 401);
        }

        $storedToken = RefreshToken::where('token', $refreshToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$storedToken) {
            return response()->json([
                'message' => 'リフレッシュトークンが無効または期限切れです',
            ], 401);
        }

        $user = $storedToken->user;

        // 古いリフレッシュトークンを削除
        $storedToken->delete();

        return $this->respondWithTokens($user, 'トークンを更新しました');
    }

    private function respondWithTokens(User $user, string $message, int $status = 200): JsonResponse
    {
        // アクセストークン（JWT）生成
        $accessToken = JWTAuth::fromUser($user);

        // リフレッシュトークン生成・保存
        $refreshToken = RefreshToken::generateToken();
        RefreshToken::create([
            'user_id' => $user->id,
            'token' => $refreshToken,
            'expires_at' => now()->addMinutes(self::REFRESH_TOKEN_TTL),
        ]);

        // セッションにトークンIDを保存（整合性チェック用）
        session(['token_id' => $user->id . ':' . substr($refreshToken, 0, 8)]);

        // 開発環境ではsecure: false、本番環境ではsecure: true
        $isSecure = app()->environment('production');
        $domain = app()->environment('local') ? 'localhost' : null;
        $sameSite = app()->environment('local') ? false : 'Lax';

        return response()->json([
            'message' => $message,
            'user' => $user,
        ], $status)
        ->withCookie(cookie(
            'access_token',
            $accessToken,
            self::ACCESS_TOKEN_TTL,
            '/',
            $domain,
            $isSecure,
            true,  // httpOnly
            false,
            $sameSite
        ))
        ->withCookie(cookie(
            'refresh_token',
            $refreshToken,
            self::REFRESH_TOKEN_TTL,
            '/',
            $domain,
            $isSecure,
            true,
            false,
            $sameSite
        ));
    }
}
