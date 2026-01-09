'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson, Schedule } from '@/types/lesson';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reservingId, setReservingId] = useState<number | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchLesson();
    }
  }, [params.id]);

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

  const handleReserve = async (scheduleId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setReservingId(scheduleId);
    try {
      await api.post('/reservations', { schedule_id: scheduleId });
      alert('予約が完了しました');
      fetchLesson(); // 予約数を更新
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || '予約に失敗しました');
    } finally {
      setReservingId(null);
    }
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

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'japanese': return 'bg-red-500';
      case 'western': return 'bg-yellow-500';
      case 'chinese': return 'bg-orange-500';
      case 'sweets': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">レッスンが見つかりませんでした</p>
          <Link href="/lessons" className="mt-4 inline-block text-orange-500 hover:underline">
            レッスン一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className={`${getCategoryColor(lesson.category)} text-white py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/lessons" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            レッスン一覧に戻る
          </Link>
          <div className="flex gap-2 mb-4">
            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
              {lesson.category_label}
            </span>
            <span className={`${getDifficultyColor(lesson.difficulty)} text-white text-sm px-3 py-1 rounded-full`}>
              {lesson.difficulty_label}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{lesson.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">レッスン内容</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{lesson.description}</p>
              </div>
            </div>

            {/* Sidebar - Schedules */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4">開催スケジュール</h2>

                {!lesson.schedules || lesson.schedules.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    現在予定されているスケジュールはありません
                  </p>
                ) : (
                  <div className="space-y-4">
                    {lesson.schedules.map((schedule: Schedule) => (
                      <div
                        key={schedule.id}
                        className="border border-gray-200 rounded-xl p-4"
                      >
                        <div className="text-sm text-gray-500 mb-1">
                          {formatDate(schedule.start_at)}
                        </div>
                        <div className="text-lg font-bold text-gray-800 mb-2">
                          {formatTime(schedule.start_at)} - {formatTime(schedule.end_at)}
                        </div>
                        {schedule.instructor && (
                          <div className="text-sm text-gray-600 mb-2">
                            講師: {schedule.instructor.name}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${schedule.is_full ? 'text-red-500' : 'text-green-600'}`}>
                            残り {schedule.available_count} / {schedule.capacity} 席
                          </span>
                          <button
                            onClick={() => handleReserve(schedule.id)}
                            disabled={schedule.is_full || reservingId === schedule.id}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                              schedule.is_full
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                          >
                            {reservingId === schedule.id
                              ? '予約中...'
                              : schedule.is_full
                              ? '満席'
                              : '予約する'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!user && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      予約するにはログインが必要です
                    </p>
                    <Link
                      href="/login"
                      className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition"
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
