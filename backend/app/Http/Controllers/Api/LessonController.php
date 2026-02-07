<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lesson\StoreLessonRequest;
use App\Http\Requests\Lesson\UpdateLessonRequest;
use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LessonController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Lesson::query();

        // キーワード検索（タイトル・説明文）
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        // カテゴリでフィルタ
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // 難易度でフィルタ
        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        // 並び替え
        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'popular':
                $query->withCount('schedules')->orderByDesc('schedules_count');
                break;
            case 'oldest':
                $query->oldest();
                break;
            default: // newest
                $query->latest();
                break;
        }

        $lessons = $query->paginate(10);

        return LessonResource::collection($lessons);
    }

    public function show(Lesson $lesson): LessonResource
    {
        return new LessonResource($lesson->load('schedules'));
    }

    public function store(StoreLessonRequest $request): JsonResponse
    {
        $lesson = Lesson::create($request->validated());

        return response()->json([
            'message' => 'レッスンを作成しました',
            'lesson' => new LessonResource($lesson),
        ], 201);
    }

    public function update(UpdateLessonRequest $request, Lesson $lesson): JsonResponse
    {
        $lesson->update($request->validated());

        return response()->json([
            'message' => 'レッスンを更新しました',
            'lesson' => new LessonResource($lesson),
        ]);
    }

    public function destroy(Lesson $lesson): JsonResponse
    {
        $lesson->delete();

        return response()->json([
            'message' => 'レッスンを削除しました',
        ]);
    }
}
