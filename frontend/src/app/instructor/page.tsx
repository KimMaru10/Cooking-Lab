'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { InstructorSchedule } from '@/types/instructor';

export default function InstructorDashboard() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [schedules, setSchedules] = useState<InstructorSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<InstructorSchedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendances, setAttendances] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'instructor') {
      router.push('/');
      return;
    }
    fetchSchedules();
  }, [isAuthLoading, user, router]);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/instructor/schedules');
      setSchedules(response.data.schedules || []);
    } catch (error) {
      console.error('スケジュールの取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLesson = async (scheduleId: number) => {
    if (!confirm('レッスンを開始しますか？')) return;

    try {
      await api.post(`/instructor/schedules/${scheduleId}/start`);
      fetchSchedules();
    } catch (error) {
      console.error('レッスン開始に失敗しました', error);
      alert('レッスン開始に失敗しました');
    }
  };

  const openAttendanceModal = (schedule: InstructorSchedule) => {
    setSelectedSchedule(schedule);
    const initialAttendances: { [key: number]: boolean } = {};
    schedule.reservations.forEach((r) => {
      initialAttendances[r.id] = r.status === 'attended' ? true : r.status === 'absent' ? false : true;
    });
    setAttendances(initialAttendances);
    setIsModalOpen(true);
  };

  const handleAttendanceSubmit = async () => {
    if (!selectedSchedule) return;

    const attendanceData = Object.entries(attendances).map(([id, attended]) => ({
      reservation_id: parseInt(id),
      attended,
    }));

    try {
      await api.post(`/instructor/schedules/${selectedSchedule.id}/attendance`, {
        attendances: attendanceData,
      });
      setIsModalOpen(false);
      fetchSchedules();
    } catch (error) {
      console.error('出席記録に失敗しました', error);
      alert('出席記録に失敗しました');
    }
  };

  const handleCompleteLesson = async (scheduleId: number) => {
    if (!confirm('レッスンを完了しますか？未処理の予約は欠席扱いになります。')) return;

    try {
      await api.post(`/instructor/schedules/${scheduleId}/complete`);
      fetchSchedules();
    } catch (error) {
      console.error('レッスン完了に失敗しました', error);
      alert('レッスン完了に失敗しました');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            トップに戻る
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">講師ダッシュボード</h1>
          <p className="mt-2 text-orange-100">担当レッスンの管理</p>
        </div>
      </section>

      {/* Schedules */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {schedules.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">担当レッスンがありません</p>
            </div>
          ) : (
            <div className="space-y-6">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {schedule.lesson.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
                            {schedule.status_label}
                          </span>
                        </div>
                        <div className="text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">日時:</span> {schedule.start_at} 〜 {schedule.end_at.split(' ')[1]}
                          </p>
                          <p>
                            <span className="font-medium">予約:</span> {schedule.reservation_count} / {schedule.capacity}名
                          </p>
                          <p>
                            <span className="font-medium">カテゴリ:</span> {schedule.lesson.category_label}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {schedule.status === 'upcoming' && schedule.can_start && (
                          <button
                            onClick={() => handleStartLesson(schedule.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            レッスン開始
                          </button>
                        )}
                        {schedule.status === 'in_progress' && (
                          <>
                            <button
                              onClick={() => openAttendanceModal(schedule)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              出席管理
                            </button>
                            <button
                              onClick={() => handleCompleteLesson(schedule.id)}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                              レッスン完了
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Reservations List */}
                    {schedule.reservations.length > 0 && (
                      <div className="mt-6 border-t pt-4">
                        <h4 className="font-medium text-gray-700 mb-3">予約者一覧</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {schedule.reservations.map((reservation) => (
                            <div
                              key={reservation.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <span className="font-medium">{reservation.user.name}</span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  reservation.status === 'attended'
                                    ? 'bg-green-100 text-green-800'
                                    : reservation.status === 'absent'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {reservation.status_label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Attendance Modal */}
      {isModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">出席管理</h3>
            <p className="text-gray-600 mb-6">{selectedSchedule.lesson.title}</p>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {selectedSchedule.reservations
                .filter((r) => r.status === 'reserved')
                .map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{reservation.user.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setAttendances((prev) => ({ ...prev, [reservation.id]: true }))
                        }
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          attendances[reservation.id]
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        出席
                      </button>
                      <button
                        onClick={() =>
                          setAttendances((prev) => ({ ...prev, [reservation.id]: false }))
                        }
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          !attendances[reservation.id]
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        欠席
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {selectedSchedule.reservations.filter((r) => r.status === 'reserved').length === 0 && (
              <p className="text-gray-500 text-center py-4">未処理の予約がありません</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                キャンセル
              </button>
              <button
                onClick={handleAttendanceSubmit}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                disabled={selectedSchedule.reservations.filter((r) => r.status === 'reserved').length === 0}
              >
                記録する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
