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

  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case 'japanese':
        return { bg: 'bg-amber-100', text: 'text-amber-800', gradient: 'from-amber-100 to-amber-50' };
      case 'western':
        return { bg: 'bg-orange-100', text: 'text-orange-800', gradient: 'from-orange-100 to-orange-50' };
      case 'chinese':
        return { bg: 'bg-red-100', text: 'text-red-800', gradient: 'from-red-100 to-red-50' };
      case 'sweets':
        return { bg: 'bg-pink-100', text: 'text-pink-800', gradient: 'from-pink-100 to-pink-50' };
      default:
        return { bg: 'bg-stone-100', text: 'text-stone-800', gradient: 'from-stone-100 to-stone-50' };
    }
  };

  const getDifficultyStyle = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800' };
      case 'intermediate':
        return { bg: 'bg-sky-100', text: 'text-sky-800' };
      case 'advanced':
        return { bg: 'bg-purple-100', text: 'text-purple-800' };
      default:
        return { bg: 'bg-stone-100', text: 'text-stone-800' };
    }
  };

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'japanese': return '🍱';
      case 'western': return '🍝';
      case 'chinese': return '🥟';
      case 'sweets': return '🍰';
      default: return '🍳';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-emerald-700 font-medium mb-2">Lesson</p>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800">レッスン一覧</h1>
          <p className="mt-2 text-stone-600">気になるレッスンを見つけて予約しましょう</p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                カテゴリ
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-40 rounded-xl border-stone-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                難易度
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="block w-40 rounded-xl border-stone-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
              <p className="mt-4 text-stone-600">読み込み中...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600">レッスンが見つかりませんでした</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => {
                const catStyle = getCategoryStyle(lesson.category);
                const diffStyle = getDifficultyStyle(lesson.difficulty);
                return (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-stone-100 group"
                  >
                    <div className={`h-40 bg-gradient-to-br ${catStyle.gradient} flex items-center justify-center`}>
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {getCategoryEmoji(lesson.category)}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-2 mb-3">
                        <span className={`${catStyle.bg} ${catStyle.text} text-xs px-3 py-1 rounded-full font-medium`}>
                          {lesson.category_label}
                        </span>
                        <span className={`${diffStyle.bg} ${diffStyle.text} text-xs px-3 py-1 rounded-full font-medium`}>
                          {lesson.difficulty_label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-emerald-700 transition">
                        {lesson.title}
                      </h3>
                      <p className="text-stone-600 text-sm line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
