'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson, Schedule } from '@/types/lesson';
import { useViewedLessonsStore } from '@/stores/viewedLessonsStore';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const addViewedLesson = useViewedLessonsStore((state) => state.addViewedLesson);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchLesson();
    }
  }, [params.id]);

  useEffect(() => {
    if (lesson) {
      addViewedLesson({
        id: lesson.id,
        title: lesson.title,
        category: lesson.category,
        category_label: lesson.category_label,
        difficulty: lesson.difficulty,
        difficulty_label: lesson.difficulty_label,
      });
    }
  }, [lesson, addViewedLesson]);

  const fetchLesson = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/lessons/${params.id}`);
      setLesson(response.data.data);
    } catch (error) {
      console.error('レッスンの取得に失敗しました', error);
      setLesson(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserve = (scheduleId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/reservations/confirm?schedule_id=${scheduleId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case 'japanese':
        return { bg: 'bg-amber-100', text: 'text-amber-800', gradient: 'from-amber-50 to-stone-50' };
      case 'western':
        return { bg: 'bg-orange-100', text: 'text-orange-800', gradient: 'from-orange-50 to-stone-50' };
      case 'chinese':
        return { bg: 'bg-red-100', text: 'text-red-800', gradient: 'from-red-50 to-stone-50' };
      case 'sweets':
        return { bg: 'bg-pink-100', text: 'text-pink-800', gradient: 'from-pink-50 to-stone-50' };
      default:
        return { bg: 'bg-stone-100', text: 'text-stone-800', gradient: 'from-stone-100 to-stone-50' };
    }
  };

  const getDifficultyStyle = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800' };
      case 'intermediate':
        return { bg: 'bg-sky-100', text: 'text-sky-800' };
      case 'advanced':
        return { bg: 'bg-purple-100', text: 'text-purple-800' };
      default:
        return { bg: 'bg-stone-100', text: 'text-stone-800' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-stone-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600">レッスンが見つかりませんでした</p>
          <Link href="/lessons" className="mt-4 inline-block text-emerald-700 hover:underline">
            レッスン一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const catStyle = getCategoryStyle(lesson.category);
  const diffStyle = getDifficultyStyle(lesson.difficulty);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className={`bg-gradient-to-br ${catStyle.gradient} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/lessons" className="inline-flex items-center text-stone-600 hover:text-emerald-700 mb-4 transition">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            レッスン一覧に戻る
          </Link>
          <div className="flex gap-2 mb-4">
            <span className={`${catStyle.bg} ${catStyle.text} text-sm px-3 py-1 rounded-full font-medium`}>
              {lesson.category_label}
            </span>
            <span className={`${diffStyle.bg} ${diffStyle.text} text-sm px-3 py-1 rounded-full font-medium`}>
              {lesson.difficulty_label}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800">{lesson.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-stone-100 p-8">
                <h2 className="text-xl font-bold text-stone-800 mb-4">レッスン内容</h2>
                <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">{lesson.description}</p>
              </div>
            </div>

            {/* Sidebar - Schedules */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-stone-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-stone-800 mb-4">開催スケジュール</h2>

                {!lesson.schedules || lesson.schedules.length === 0 ? (
                  <p className="text-stone-500 text-center py-8">
                    現在予定されているスケジュールはありません
                  </p>
                ) : (
                  <div className="space-y-4">
                    {lesson.schedules.map((schedule: Schedule) => (
                      <div
                        key={schedule.id}
                        className="border border-stone-200 rounded-xl p-4"
                      >
                        <div className="text-sm text-stone-500 mb-1">
                          {formatDate(schedule.start_at)}
                        </div>
                        <div className="text-lg font-bold text-stone-800 mb-2">
                          {formatTime(schedule.start_at)} - {formatTime(schedule.end_at)}
                        </div>
                        {schedule.instructor && (
                          <div className="text-sm text-stone-600 mb-2">
                            講師: {schedule.instructor.name}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${schedule.is_full ? 'text-red-600' : 'text-emerald-700'}`}>
                            残り {schedule.available_count} / {schedule.capacity} 席
                          </span>
                          <button
                            onClick={() => handleReserve(schedule.id)}
                            disabled={schedule.is_full}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                              schedule.is_full
                                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                                : 'bg-emerald-700 text-white hover:bg-emerald-800'
                            }`}
                          >
                            {schedule.is_full ? '満席' : '予約する'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!user && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl text-center border border-amber-100">
                    <p className="text-sm text-stone-600 mb-2">
                      予約するにはログインが必要です
                    </p>
                    <Link
                      href="/login"
                      className="inline-block bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-emerald-800 transition"
                    >
                      ログイン
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
