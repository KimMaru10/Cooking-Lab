'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Reservation, Ticket } from '@/types/reservation';

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

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

  const handleCancel = async (reservationId: number) => {
    if (!confirm('この予約をキャンセルしますか？')) return;

    setCancellingId(reservationId);
    try {
      await api.delete(`/reservations/${reservationId}`);
      alert('予約をキャンセルしました');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">マイページ</h1>
          <p className="mt-2 text-orange-100">{user?.name} さん</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tickets Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4">チケット残数</h2>
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-orange-500">
                    {totalRemainingTickets}
                  </div>
                  <div className="text-gray-600 mt-2">回分</div>
                </div>

                {tickets.filter((t) => t.is_valid).length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">チケット詳細</h3>
                    <div className="space-y-2">
                      {tickets
                        .filter((t) => t.is_valid)
                        .map((ticket) => (
                          <div
                            key={ticket.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">{ticket.plan_label}</span>
                            <span className="font-medium">
                              残り {ticket.remaining_count} 回
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <Link
                  href="/tickets/purchase"
                  className="mt-6 block w-full bg-orange-500 text-white text-center py-3 rounded-full font-medium hover:bg-orange-600 transition"
                >
                  チケットを購入
                </Link>
              </div>
            </div>

            {/* Reservations */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">予約履歴</h2>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">読み込み中...</p>
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">予約履歴がありません</p>
                    <Link
                      href="/lessons"
                      className="mt-4 inline-block text-orange-500 hover:underline"
                    >
                      レッスンを探す
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border border-gray-200 rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            {reservation.schedule?.lesson && (
                              <Link
                                href={`/lessons/${reservation.schedule.lesson.id}`}
                                className="text-lg font-bold text-gray-800 hover:text-orange-500"
                              >
                                {reservation.schedule.lesson.title}
                              </Link>
                            )}
                            {reservation.schedule && (
                              <div className="text-sm text-gray-600 mt-1">
                                {formatDate(reservation.schedule.start_at)}{' '}
                                {formatTime(reservation.schedule.start_at)} -{' '}
                                {formatTime(reservation.schedule.end_at)}
                              </div>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              reservation.status === 'reserved'
                                ? 'bg-green-100 text-green-700'
                                : reservation.status === 'cancelled'
                                ? 'bg-gray-100 text-gray-700'
                                : reservation.status === 'attended'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {reservation.status_label}
                          </span>
                        </div>

                        {reservation.status === 'reserved' && (
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => handleCancel(reservation.id)}
                              disabled={cancellingId === reservation.id}
                              className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                            >
                              {cancellingId === reservation.id
                                ? 'キャンセル中...'
                                : '予約をキャンセル'}
                            </button>
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
    </div>
  );
}
