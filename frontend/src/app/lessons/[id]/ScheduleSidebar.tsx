'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson, Schedule } from '@/types/lesson';
import { useViewedLessonsStore } from '@/stores/viewedLessonsStore';

type Props = {
  lesson: Lesson;
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

export default function ScheduleSidebar({ lesson }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const addViewedLesson = useViewedLessonsStore((state) => state.addViewedLesson);

  const isSuspended = user?.suspended_until && new Date(user.suspended_until) > new Date();

  useEffect(() => {
    addViewedLesson({
      id: lesson.id,
      title: lesson.title,
      category: lesson.category,
      category_label: lesson.category_label,
      difficulty: lesson.difficulty,
      difficulty_label: lesson.difficulty_label,
    });
  }, [lesson, addViewedLesson]);

  const handleReserve = (scheduleId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (isSuspended) {
      return;
    }
    router.push(`/reservations/confirm?schedule_id=${scheduleId}`);
  };

  return (
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
                  disabled={schedule.is_full || !!isSuspended}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    schedule.is_full || isSuspended
                      ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                      : 'bg-emerald-700 text-white hover:bg-emerald-800'
                  }`}
                >
                  {schedule.is_full ? '満席' : isSuspended ? '予約停止中' : '予約する'}
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

      {isSuspended && (
        <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
          <p className="text-sm text-red-800 font-medium mb-1">予約が停止されています</p>
          <p className="text-xs text-red-600">
            {user?.suspended_until && new Date(user.suspended_until).toLocaleDateString('ja-JP')} まで新規予約ができません
          </p>
        </div>
      )}
    </div>
  );
}
