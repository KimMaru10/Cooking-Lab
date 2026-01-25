'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Reservation, Ticket } from '@/types/reservation';
import { useViewedLessonsStore } from '@/stores/viewedLessonsStore';

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const viewedLessons = useViewedLessonsStore((state) => state.viewedLessons);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelModalReservation, setCancelModalReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [reservationsRes, ticketsRes] = await Promise.all([
        api.get('/reservations'),
        api.get('/tickets'),
      ]);
      setReservations(reservationsRes.data.data);
      setTickets(ticketsRes.data.data);
    } catch (error) {
      console.error('データの取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canCancel = (reservation: Reservation): boolean => {
    if (!reservation.schedule) return false;
    const startAt = new Date(reservation.schedule.start_at);
    const now = new Date();
    const hoursUntilStart = (startAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilStart >= 24;
  };

  const handleCancelClick = (reservation: Reservation) => {
    setCancelModalReservation(reservation);
  };

  const handleCancelConfirm = async () => {
    if (!cancelModalReservation) return;

    setCancellingId(cancelModalReservation.id);
    try {
      await api.delete(`/reservations/${cancelModalReservation.id}`);
      setCancelModalReservation(null);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'キャンセルに失敗しました');
    } finally {
      setCancellingId(null);
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

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-emerald-700 font-medium mb-2">My Page</p>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800">マイページ</h1>
          <p className="mt-2 text-stone-600">{user?.name} さん</p>
        </div>
      </section>

      {/* Suspension Alert */}
      {user?.suspended_until && new Date(user.suspended_until) > new Date() && (
        <section className="bg-red-50 border-b border-red-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-red-800 font-medium">予約が停止されています</p>
                <p className="text-red-600 text-sm">
                  ペナルティにより {new Date(user.suspended_until).toLocaleDateString('ja-JP')} まで新規予約ができません
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tickets Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-stone-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-stone-800 mb-4">チケット残数</h2>
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-emerald-700">
                    {totalRemainingTickets}
                  </div>
                  <div className="text-stone-600 mt-2">回分</div>
                </div>

                {tickets.filter((t) => t.is_valid).length > 0 && (
                  <div className="border-t border-stone-100 pt-4 mt-4">
                    <h3 className="text-sm font-medium text-stone-700 mb-2">チケット詳細</h3>
                    <div className="space-y-3">
                      {tickets
                        .filter((t) => t.is_valid)
                        .map((ticket) => (
                          <div
                            key={ticket.id}
                            className="bg-stone-50 rounded-xl p-3"
                          >
                            <div className="flex justify-between">
                              <span className="text-stone-600">{ticket.plan_label}</span>
                              <span className="font-medium text-stone-800">
                                残り {ticket.remaining_count} 回
                              </span>
                            </div>
                            <div className="text-xs text-stone-500 mt-1">
                              有効期限: {new Date(ticket.expires_at).toLocaleDateString('ja-JP')}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {tickets.filter((t) => t.is_expired && t.remaining_count > 0).length > 0 && (
                  <div className="border-t border-stone-100 pt-4 mt-4">
                    <h3 className="text-sm font-medium text-red-600 mb-2">期限切れチケット</h3>
                    <div className="space-y-2">
                      {tickets
                        .filter((t) => t.is_expired && t.remaining_count > 0)
                        .map((ticket) => (
                          <div
                            key={ticket.id}
                            className="bg-red-50 rounded-xl p-3 text-sm"
                          >
                            <div className="flex justify-between text-red-700">
                              <span>{ticket.plan_label}</span>
                              <span>{ticket.remaining_count} 回分失効</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <Link
                  href="/tickets/purchase"
                  className="mt-6 block w-full bg-emerald-700 text-white text-center py-3 rounded-xl font-medium hover:bg-emerald-800 transition"
                >
                  チケットを購入
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Viewed Lessons */}
              {viewedLessons.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-100 p-6">
                  <h2 className="text-xl font-bold text-stone-800 mb-4">最近見た講座</h2>
                  <div className="space-y-3">
                    {viewedLessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/lessons/${lesson.id}`}
                        className="block border border-stone-200 rounded-xl p-4 hover:border-emerald-300 hover:bg-emerald-50 transition"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-stone-800">{lesson.title}</div>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                                {lesson.category_label}
                              </span>
                              <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                                {lesson.difficulty_label}
                              </span>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Reservations */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 className="text-xl font-bold text-stone-800 mb-4">予約履歴</h2>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
                    <p className="mt-4 text-stone-600">読み込み中...</p>
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-stone-500">予約履歴がありません</p>
                    <Link
                      href="/lessons"
                      className="mt-4 inline-block text-emerald-700 hover:underline"
                    >
                      レッスンを探す
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border border-stone-200 rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            {reservation.schedule?.lesson && (
                              <Link
                                href={`/lessons/${reservation.schedule.lesson.id}`}
                                className="text-lg font-bold text-stone-800 hover:text-emerald-700"
                              >
                                {reservation.schedule.lesson.title}
                              </Link>
                            )}
                            {reservation.schedule && (
                              <div className="text-sm text-stone-600 mt-1">
                                {formatDate(reservation.schedule.start_at)}{' '}
                                {formatTime(reservation.schedule.start_at)} -{' '}
                                {formatTime(reservation.schedule.end_at)}
                              </div>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              reservation.status === 'reserved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : reservation.status === 'cancelled'
                                ? 'bg-stone-100 text-stone-700'
                                : reservation.status === 'attended'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {reservation.status_label}
                          </span>
                        </div>

                        {reservation.status === 'reserved' && (
                          <div className="mt-4 flex justify-end">
                            {canCancel(reservation) ? (
                              <button
                                onClick={() => handleCancelClick(reservation)}
                                disabled={cancellingId === reservation.id}
                                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                              >
                                予約をキャンセル
                              </button>
                            ) : (
                              <span className="text-sm text-stone-400">
                                24時間前を過ぎたためキャンセル不可
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cancel Confirmation Modal */}
      {cancelModalReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-stone-800 mb-4">
              予約をキャンセルしますか？
            </h3>

            {cancelModalReservation.schedule?.lesson && (
              <div className="bg-stone-50 rounded-xl p-4 mb-4">
                <div className="font-medium text-stone-800">
                  {cancelModalReservation.schedule.lesson.title}
                </div>
                <div className="text-sm text-stone-600 mt-1">
                  {formatDate(cancelModalReservation.schedule.start_at)}{' '}
                  {formatTime(cancelModalReservation.schedule.start_at)} -{' '}
                  {formatTime(cancelModalReservation.schedule.end_at)}
                </div>
              </div>
            )}

            <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-emerald-800 font-medium">
                  チケット1回分が返却されます
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalReservation(null)}
                className="flex-1 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition"
              >
                戻る
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={cancellingId !== null}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {cancellingId !== null ? 'キャンセル中...' : 'キャンセルする'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
