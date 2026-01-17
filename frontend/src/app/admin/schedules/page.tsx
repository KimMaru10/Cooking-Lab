'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson, Schedule } from '@/types/lesson';

type ScheduleForm = {
  lesson_id: number;
  instructor_id: number;
  start_at: string;
  end_at: string;
  capacity: number;
};

type Instructor = {
  id: number;
  name: string;
};

export default function AdminSchedulesPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form, setForm] = useState<ScheduleForm>({
    lesson_id: 0,
    instructor_id: 0,
    start_at: '',
    end_at: '',
    capacity: 6,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    fetchData();
  }, [isAuthLoading, user, router]);

  const fetchData = async () => {
    try {
      const [schedulesRes, lessonsRes] = await Promise.all([
        api.get('/schedules'),
        api.get('/lessons'),
      ]);
      setSchedules(schedulesRes.data.data || schedulesRes.data || []);
      setLessons(lessonsRes.data.data || lessonsRes.data || []);

      // 講師リストはスケジュールから抽出
      const instructorMap = new Map<number, Instructor>();
      (schedulesRes.data.data || schedulesRes.data || []).forEach((s: Schedule) => {
        if (s.instructor) {
          instructorMap.set(s.instructor.id, { id: s.instructor.id, name: s.instructor.name });
        }
      });
      setInstructors(Array.from(instructorMap.values()));
    } catch (error) {
      console.error('データの取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSchedule(null);
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    const start = now.toISOString().slice(0, 16);
    now.setHours(now.getHours() + 1);
    const end = now.toISOString().slice(0, 16);

    setForm({
      lesson_id: lessons[0]?.id || 0,
      instructor_id: instructors[0]?.id || 0,
      start_at: start,
      end_at: end,
      capacity: 6,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setForm({
      lesson_id: schedule.lesson?.id || 0,
      instructor_id: schedule.instructor?.id || 0,
      start_at: schedule.start_at.slice(0, 16).replace(' ', 'T'),
      end_at: schedule.end_at.slice(0, 16).replace(' ', 'T'),
      capacity: schedule.capacity,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...form,
      start_at: form.start_at.replace('T', ' ') + ':00',
      end_at: form.end_at.replace('T', ' ') + ':00',
    };

    try {
      if (editingSchedule) {
        await api.put(`/schedules/${editingSchedule.id}`, payload);
      } else {
        await api.post('/schedules', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('保存に失敗しました', error);
      alert('保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (schedule: Schedule) => {
    if (!confirm('このスケジュールを削除しますか？')) return;

    try {
      await api.delete(`/schedules/${schedule.id}`);
      fetchData();
    } catch (error) {
      console.error('削除に失敗しました', error);
      alert('削除に失敗しました');
    }
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">スケジュール管理</h1>
              <p className="mt-2 text-gray-300">開催日程の登録・編集</p>
            </div>
            <button
              onClick={openCreateModal}
              disabled={lessons.length === 0}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
            >
              新規登録
            </button>
          </div>
        </div>
      </section>

      {/* Schedules List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {schedules.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">スケジュールがありません</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      レッスン
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      講師
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      予約/定員
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {schedule.lesson?.title || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {schedule.instructor?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        <div>{formatDateTime(schedule.start_at)}</div>
                        <div className="text-gray-400">〜 {formatDateTime(schedule.end_at)}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {schedule.reservation_count} / {schedule.capacity}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(schedule.status)}`}>
                          {schedule.status_label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(schedule)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(schedule)}
                          className="text-red-600 hover:text-red-800"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-6">
              {editingSchedule ? 'スケジュール編集' : 'スケジュール新規登録'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  レッスン
                </label>
                <select
                  value={form.lesson_id}
                  onChange={(e) => setForm({ ...form, lesson_id: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  講師ID
                </label>
                <input
                  type="number"
                  value={form.instructor_id}
                  onChange={(e) => setForm({ ...form, instructor_id: parseInt(e.target.value) })}
                  required
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="講師のユーザーID"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    開始日時
                  </label>
                  <input
                    type="datetime-local"
                    value={form.start_at}
                    onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    終了日時
                  </label>
                  <input
                    type="datetime-local"
                    value={form.end_at}
                    onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  定員
                </label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
                  required
                  min={1}
                  max={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {isSubmitting ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
