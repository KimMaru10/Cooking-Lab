'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type AdminReservation = {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  schedule: {
    id: number;
    start_at: string;
    end_at: string;
    lesson: {
      id: number;
      title: string;
    };
    instructor: {
      id: number;
      name: string;
    };
  };
  status: string;
  status_label: string;
  reserved_at: string;
  cancelled_at: string | null;
};

export default function AdminReservationsPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'staff') {
      router.push('/');
      return;
    }
    fetchReservations();
  }, [isAuthLoading, user, router]);

  const fetchReservations = async (status?: string) => {
    setIsLoading(true);
    try {
      const params = status ? `?status=${status}` : '';
      const response = await api.get(`/admin/reservations${params}`);
      setReservations(response.data.data || []);
    } catch (error) {
      console.error('予約の取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    fetchReservations(status);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reserved':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'attended':
        return 'bg-blue-100 text-blue-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            管理画面に戻る
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">予約一覧</h1>
          <p className="mt-2 text-gray-300">全予約の確認・管理</p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {[
              { value: '', label: 'すべて' },
              { value: 'reserved', label: '予約中' },
              { value: 'attended', label: '出席' },
              { value: 'absent', label: '欠席' },
              { value: 'cancelled', label: 'キャンセル' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusFilter(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  statusFilter === option.value
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reservations List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {reservations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">予約がありません</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      予約者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      レッスン
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      講師
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      予約日時
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {reservation.user?.name || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.user?.email || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {reservation.schedule?.lesson?.title || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {reservation.schedule ? formatDateTime(reservation.schedule.start_at) : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {reservation.schedule?.instructor?.name || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {reservation.status_label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {formatDateTime(reservation.reserved_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
