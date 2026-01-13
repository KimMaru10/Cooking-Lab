<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class RecipeController extends Controller
{
    private const RAKUTEN_API_BASE_URL = 'https://app.rakuten.co.jp/services/api/Recipe';
    private const CACHE_TTL = 3600; // 1時間キャッシュ

    /**
     * カテゴリ一覧を取得
     */
    public function categories(): JsonResponse
    {
        $cacheKey = 'rakuten_recipe_categories';

        $categories = Cache::remember($cacheKey, self::CACHE_TTL, function () {
            $response = Http::get(self::RAKUTEN_API_BASE_URL . '/CategoryList/20170426', [
                'applicationId' => config('services.rakuten.app_id'),
                'categoryType' => 'large',
                'formatVersion' => 2,
            ]);

            if ($response->failed()) {
                return null;
            }

            return $response->json()['result']['large'] ?? [];
        });

        if ($categories === null) {
            return response()->json([
                'message' => 'カテゴリの取得に失敗しました',
            ], 500);
        }

        return response()->json([
            'categories' => $categories,
        ]);
    }

    /**
     * カテゴリ別ランキングを取得
     */
    public function ranking(Request $request): JsonResponse
    {
        $categoryId = $request->query('category_id');
        $cacheKey = 'rakuten_recipe_ranking_' . ($categoryId ?? 'all');

        $recipes = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($categoryId) {
            $params = [
                'applicationId' => config('services.rakuten.app_id'),
                'formatVersion' => 2,
            ];

            if ($categoryId) {
                $params['categoryId'] = $categoryId;
            }

            $response = Http::get(self::RAKUTEN_API_BASE_URL . '/CategoryRanking/20170426', $params);

            if ($response->failed()) {
                return null;
            }

            return $response->json()['result'] ?? [];
        });

        if ($recipes === null) {
            return response()->json([
                'message' => 'レシピの取得に失敗しました',
            ], 500);
        }

        return response()->json([
            'recipes' => $recipes,
        ]);
    }
}
