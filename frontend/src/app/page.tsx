'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Reservation, Ticket } from '@/types/reservation';

type Lesson = {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_minutes: number;
  instructor?: {
    name: string;
  };
};

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lessonsRes = await api.get('/lessons');
        setLessons((lessonsRes.data.data || []).slice(0, 4));

        if (user) {
          const [reservationsRes, ticketsRes] = await Promise.all([
            api.get('/reservations'),
            api.get('/tickets'),
          ]);
          setReservations(
            (reservationsRes.data.data || [])
              .filter((r: Reservation) => r.status === 'reserved')
              .slice(0, 3)
          );
          setTickets(ticketsRes.data.data || []);
        }
      } catch (error) {
        console.error('データの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  const categoryLabel: Record<string, string> = {
    japanese: '和食',
    western: '洋食',
    chinese: '中華',
    sweets: 'スイーツ',
  };

  const difficultyLabel: Record<string, string> = {
    beginner: '初級',
    intermediate: '中級',
    advanced: '上級',
  };

  const categoryEmoji: Record<string, string> = {
    japanese: '🍱',
    western: '🍝',
    chinese: '🥟',
    sweets: '🍰',
  };

  const totalRemainingTickets = tickets
    .filter((t) => t.is_valid)
    .reduce((sum, t) => sum + t.remaining_count, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
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

  // ログイン後のトップページ
  if (user) {
    return (
      <div className="bg-stone-50 min-h-screen">
        {/* Logged-in Hero */}
        <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-emerald-700 font-medium mb-1">
                  おかえりなさい
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-stone-800">
                  {user.name} さん
                </h1>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/lessons"
                  className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-800 transition"
                >
                  レッスンを探す
                </Link>
                <Link
                  href="/tickets/purchase"
                  className="bg-white text-stone-700 px-6 py-3 rounded-xl font-medium border border-stone-200 hover:bg-stone-50 transition"
                >
                  チケット購入
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ticket Summary Card */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-stone-800">チケット残数</h2>
                  <Link
                    href="/tickets/purchase"
                    className="text-sm text-emerald-700 hover:underline"
                  >
                    購入する
                  </Link>
                </div>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-emerald-700">
                    {totalRemainingTickets}
                  </div>
                  <div className="text-stone-500 text-sm mt-1">回分</div>
                </div>
                {totalRemainingTickets === 0 && (
                  <p className="text-center text-sm text-stone-500 mt-2">
                    チケットを購入してレッスンを予約しましょう
                  </p>
                )}
              </div>

              {/* Upcoming Reservations */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-stone-800">予約中のレッスン</h2>
                  <Link
                    href="/mypage"
                    className="text-sm text-emerald-700 hover:underline"
                  >
                    すべて見る
                  </Link>
                </div>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-emerald-600 border-t-transparent"></div>
                  </div>
                ) : reservations.length > 0 ? (
                  <div className="space-y-3">
                    {reservations.map((reservation) => (
                      <Link
                        key={reservation.id}
                        href={`/lessons/${reservation.schedule?.lesson?.id}`}
                        className="block border border-stone-200 rounded-xl p-4 hover:border-emerald-300 hover:bg-emerald-50/50 transition"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-stone-800">
                              {reservation.schedule?.lesson?.title}
                            </div>
                            {reservation.schedule && (
                              <div className="text-sm text-stone-500 mt-1">
                                {formatDate(reservation.schedule.start_at)}{' '}
                                {formatTime(reservation.schedule.start_at)}〜
                              </div>
                            )}
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">
                            予約済み
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-stone-500 mb-4">予約中のレッスンはありません</p>
                    <Link
                      href="/lessons"
                      className="inline-block text-emerald-700 font-medium hover:underline"
                    >
                      レッスンを探す →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Lessons */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-emerald-700 font-medium mb-1">Recommended</p>
                <h2 className="text-xl md:text-2xl font-bold text-stone-800">
                  おすすめのレッスン
                </h2>
              </div>
              <Link
                href="/lessons"
                className="text-emerald-700 font-medium hover:underline hidden sm:block"
              >
                すべて見る →
              </Link>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
              </div>
            ) : lessons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-stone-100"
                  >
                    <div className="h-28 bg-gradient-to-br from-amber-100 to-emerald-100 flex items-center justify-center">
                      <span className="text-4xl">
                        {categoryEmoji[lesson.category] || '🍳'}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-2 mb-2">
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                          {categoryLabel[lesson.category] || lesson.category}
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                          {difficultyLabel[lesson.difficulty] || lesson.difficulty}
                        </span>
                      </div>
                      <h3 className="font-bold text-stone-800 mb-1 group-hover:text-emerald-700 transition text-sm">
                        {lesson.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-stone-500 py-8">
                現在公開中のレッスンはありません
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }

  // 未ログイン時のトップページ（従来のデザイン）
  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 py-20 md:py-28 overflow-hidden">
        <div className="absolute top-10 right-10 text-6xl opacity-10">👨‍🍳</div>
        <div className="absolute bottom-10 left-10 text-5xl opacity-10">🥘</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-emerald-700 font-medium mb-3">
              オンライン料理教室
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-stone-800">
              プロと一緒に、
              <br />
              <span className="text-emerald-700">おうちで</span>料理しよう
            </h1>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              自宅のキッチンから参加できるライブレッスン。
              <br className="hidden md:block" />
              わからないことは、その場で質問できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lessons"
                className="bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition shadow-md"
              >
                レッスンを見る
              </Link>
              <Link
                href="/register"
                className="border-2 border-stone-300 text-stone-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition"
              >
                無料で会員登録
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Lessons */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-emerald-700 font-medium mb-1">Lesson</p>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
                人気のレッスン
              </h2>
            </div>
            <Link
              href="/lessons"
              className="text-emerald-700 font-medium hover:underline hidden sm:block"
            >
              すべて見る →
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
            </div>
          ) : lessons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="bg-stone-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-stone-100"
                >
                  <div className="h-32 bg-gradient-to-br from-amber-100 to-emerald-100 flex items-center justify-center">
                    <span className="text-5xl">
                      {categoryEmoji[lesson.category] || '🍳'}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                        {categoryLabel[lesson.category] || lesson.category}
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                        {difficultyLabel[lesson.difficulty] || lesson.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-800 mb-1 group-hover:text-emerald-700 transition">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-stone-500 line-clamp-2">
                      {lesson.description}
                    </p>
                    {lesson.instructor && (
                      <p className="text-xs text-stone-400 mt-2">
                        講師: {lesson.instructor.name}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-stone-500 py-8">
              現在公開中のレッスンはありません
            </p>
          )}

          <div className="text-center mt-6 sm:hidden">
            <Link
              href="/lessons"
              className="text-emerald-700 font-medium hover:underline"
            >
              すべてのレッスンを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-b from-stone-100 to-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald-700 font-medium mb-1">Feature</p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
              おうちシェフの特徴
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-stone-800">
                どこからでも参加
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                スマホやPCがあれば、自宅のキッチンからライブで参加できます。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-stone-800">
                その場で質問できる
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                動画を見るだけじゃない。わからないことはリアルタイムで聞けます。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍🍳</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-stone-800">
                プロの講師が指導
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                現役の料理人やパティシエから、本格的な技術を学べます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald-700 font-medium mb-1">How it works</p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
              レッスンの流れ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-bold mb-2 text-stone-800">レッスンを予約</h3>
              <p className="text-sm text-stone-600">
                気になるレッスンを選んで
                <br />
                日程を予約します
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-bold mb-2 text-stone-800">材料を準備</h3>
              <p className="text-sm text-stone-600">
                レッスン前に届く
                <br />
                材料リストで買い出し
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-bold mb-2 text-stone-800">一緒に料理</h3>
              <p className="text-sm text-stone-600">
                当日はオンラインで
                <br />
                講師と一緒に作ります
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            まずは会員登録から
          </h2>
          <p className="text-emerald-100 mb-8">
            無料で登録して、レッスンをチェックしてみましょう
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition shadow-md"
          >
            無料で会員登録
          </Link>
        </div>
      </section>
    </div>
  );
}
