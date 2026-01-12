'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Schedule } from '@/types/lesson';
import { Ticket } from '@/types/reservation';

type ScheduleWithLesson = Schedule & {
  lesson?: {
    id: number;
    title: string;
    category: string;
    category_label: string;
    difficulty: string;
    difficulty_label: string;
  };
};

export default function ReservationConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get('schedule_id');
  const { user, isLoading: authLoading } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleWithLesson | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && scheduleId) {
      fetchData();
    }
  }, [user, scheduleId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [scheduleRes, ticketsRes] = await Promise.all([
        api.get(`/schedules/${scheduleId}`),
        api.get('/tickets'),
      ]);
      setSchedule(scheduleRes.data.data);
      setTickets(ticketsRes.data.data);
    } catch (error) {
      console.error('データの取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!scheduleId) return;

    setIsSubmitting(true);
    try {
      await api.post('/reservations', { schedule_id: Number(scheduleId) });
      router.push('/reservations/complete');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || '予約に失敗しました');
      setIsSubmitting(false);
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

  const totalRemainingTickets = tickets
    .filter((t) => t.is_valid)
    .reduce((sum, t) => sum + t.remaining_count, 0);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">スケジュールが見つかりませんでした</p>
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
      <section className="bg-orange-500 text-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Steps */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white text-orange-500 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="ml-2 text-sm">選択</span>
            </div>
            <div className="w-12 h-0.5 bg-white mx-2"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white text-orange-500 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="ml-2 text-sm font-bold">確認</span>
            </div>
            <div className="w-12 h-0.5 bg-white/50 mx-2"></div>
            <div className="flex items-center opacity-50">
              <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="ml-2 text-sm">完了</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center">予約内容の確認</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Reservation Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">予約内容</h2>

            {schedule.lesson && (
              <div className="border-b pb-4 mb-4">
                <div className="text-sm text-gray-500 mb-1">レッスン</div>
                <div className="text-xl font-bold text-gray-800">{schedule.lesson.title}</div>
                <div className="flex gap-2 mt-2">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {schedule.lesson.category_label}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {schedule.lesson.difficulty_label}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">日時</div>
                <div className="font-medium text-gray-800">
                  {formatDate(schedule.start_at)}
                </div>
                <div className="text-gray-600">
                  {formatTime(schedule.start_at)} - {formatTime(schedule.end_at)}
                </div>
              </div>
              {schedule.instructor && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">講師</div>
                  <div className="font-medium text-gray-800">{schedule.instructor.name}</div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">チケット情報</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">使用チケット</div>
                <div className="font-medium text-gray-800">1回分</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">残りチケット</div>
                <div className="font-medium text-gray-800">
                  {totalRemainingTickets}回 → {totalRemainingTickets - 1}回
                </div>
              </div>
            </div>

            {totalRemainingTickets === 0 && (
              <div className="mt-4 p-4 bg-red-50 rounded-xl">
                <p className="text-red-600 text-sm">
                  チケットがありません。先にチケットを購入してください。
                </p>
                <Link
                  href="/tickets/purchase"
                  className="mt-2 inline-block text-red-600 hover:underline text-sm font-medium"
                >
                  チケットを購入する →
                </Link>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.back()}
              className="flex-1 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
            >
              戻る
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || totalRemainingTickets === 0}
              className={`flex-1 py-4 rounded-full font-bold transition ${
                isSubmitting || totalRemainingTickets === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {isSubmitting ? '予約中...' : '予約を確定する'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
