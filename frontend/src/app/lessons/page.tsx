import { Lesson } from '@/types/lesson';
import LessonList from './LessonList';

async function getLessons(): Promise<Lesson[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons`, {
    next: { revalidate: 60 }, // 60秒ごとに再生成（ISR）
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.data;
}

export const metadata = {
  title: 'レッスン一覧 | Cooking Lab',
  description: '料理教室のレッスン一覧です。和食、洋食、中華、スイーツなど様々なカテゴリから選べます。',
};

export default async function LessonsPage() {
  const lessons = await getLessons();

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

      <LessonList lessons={lessons} />
    </div>
  );
}
