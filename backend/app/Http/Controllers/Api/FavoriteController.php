<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FavoriteController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $lessons = $request->user()
            ->favoriteLessons()
            ->latest('favorites.created_at')
            ->paginate(10);

        return LessonResource::collection($lessons);
    }

    public function toggle(Request $request, Lesson $lesson): JsonResponse
    {
        $user = $request->user();
        $exists = $user->favorites()->where('lesson_id', $lesson->id)->exists();

        if ($exists) {
            $user->favorites()->where('lesson_id', $lesson->id)->delete();

            return response()->json([
                'message' => 'お気に入りを解除しました',
                'is_favorited' => false,
            ]);
        }

        $user->favorites()->create(['lesson_id' => $lesson->id]);

        return response()->json([
            'message' => 'お気に入りに追加しました',
            'is_favorited' => true,
        ]);
    }

    public function check(Request $request): JsonResponse
    {
        $lessonIds = $request->query('lesson_ids', '');
        $ids = array_filter(explode(',', $lessonIds));

        if (empty($ids)) {
            return response()->json(['favorites' => []]);
        }

        $favoritedIds = $request->user()
            ->favorites()
            ->whereIn('lesson_id', $ids)
            ->pluck('lesson_id');

        return response()->json(['favorites' => $favoritedIds]);
    }
}
