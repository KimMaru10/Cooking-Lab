'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Lesson } from '@/types/lesson';

const categories = [
  { value: '', label: 'すべて' },
  { value: 'japanese', label: '和食' },
  { value: 'western', label: '洋食' },
  { value: 'chinese', label: '中華' },
  { value: 'sweets', label: 'スイーツ' },
];

const difficulties = [
  { value: '', label: 'すべて' },
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' },
];

export default function LessonsPage() {
  const searchParams = useSearchParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');

  useEffect(() => {
    fetchLessons();
  }, [category, difficulty]);

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);

      const response = await api.get(`/lessons?${params.toString()}`);
      setLessons(response.data.data);
    } catch (error) {
      console.error('レッスンの取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">レッスン一覧</h1>
          <p className="mt-2 text-orange-100">お好みのレッスンを見つけましょう</p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-40 rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                難易度
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="block w-40 rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">読み込み中...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">レッスンが見つかりませんでした</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Placeholder Image */}
                  <div className={`h-48 ${getCategoryColor(lesson.category)} flex items-center justify-center`}>
                    <span className="text-6xl">
                      {lesson.category === 'japanese' && '🍱'}
                      {lesson.category === 'western' && '🍝'}
                      {lesson.category === 'chinese' && '🥟'}
                      {lesson.category === 'sweets' && '🍰'}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className={`${getCategoryColor(lesson.category)} text-white text-xs px-2 py-1 rounded-full`}>
                        {lesson.category_label}
                      </span>
                      <span className={`${getDifficultyColor(lesson.difficulty)} text-white text-xs px-2 py-1 rounded-full`}>
                        {lesson.difficulty_label}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
