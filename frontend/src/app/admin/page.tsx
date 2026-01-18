'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type DashboardStats = {
  lessonsCount: number;
  schedulesCount: number;
  reservationsCount: number;
  ticketsCount: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    lessonsCount: 0,
    schedulesCount: 0,
    reservationsCount: 0,
    ticketsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

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
    fetchStats();
  }, [isAuthLoading, user, router]);

  const fetchStats = async () => {
    try {
      const [lessonsRes, schedulesRes, reservationsRes, ticketsRes] = await Promise.all([
        api.get('/lessons'),
        api.get('/schedules'),
        api.get('/admin/reservations'),
        api.get('/admin/tickets'),
      ]);
      setStats({
        lessonsCount: lessonsRes.data.data?.length || lessonsRes.data.length || 0,
        schedulesCount: schedulesRes.data.data?.length || schedulesRes.data.length || 0,
        reservationsCount: reservationsRes.data.meta?.total || reservationsRes.data.data?.length || 0,
        ticketsCount: ticketsRes.data.meta?.total || ticketsRes.data.data?.length || 0,
      });
    } catch (error) {
      console.error('統計情報の取得に失敗しました', error);
    } finally {
      setIsLoading(false);
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
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            トップに戻る
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">管理画面</h1>
          <p className="mt-2 text-gray-300">運営スタッフ用ダッシュボード</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl font-bold text-orange-500">{stats.lessonsCount}</div>
              <div className="text-gray-600 mt-1">レッスン</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl font-bold text-blue-500">{stats.schedulesCount}</div>
              <div className="text-gray-600 mt-1">スケジュール</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl font-bold text-green-500">{stats.reservationsCount}</div>
              <div className="text-gray-600 mt-1">予約</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl font-bold text-purple-500">{stats.ticketsCount}</div>
              <div className="text-gray-600 mt-1">チケット</div>
            </div>
          </div>

          {/* Menu */}
          <h2 className="text-xl font-bold text-gray-800 mb-6">管理メニュー</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/lessons"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-orange-500 transition">
                    レッスン管理
                  </h3>
                  <p className="text-sm text-gray-500">レッスンの登録・編集・削除</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/schedules"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-500 transition">
                    スケジュール管理
                  </h3>
                  <p className="text-sm text-gray-500">開催日程の登録・編集</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/reservations"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-green-500 transition">
                    予約一覧
                  </h3>
                  <p className="text-sm text-gray-500">全予約の確認</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
