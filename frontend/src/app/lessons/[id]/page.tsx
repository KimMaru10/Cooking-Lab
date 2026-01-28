import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lesson } from '@/types/lesson';
import ScheduleSidebar from './ScheduleSidebar';

async function getLesson(id: string): Promise<Lesson | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}`, {
    next: { revalidate: 60 }, // 60秒ごとに再生成（ISR）
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await getLesson(id);

  if (!lesson) {
    return { title: 'レッスンが見つかりません | Cooking Lab' };
  }

  return {
    title: `${lesson.title} | Cooking Lab`,
    description: lesson.description.slice(0, 160),
  };
}

const getCategoryStyle = (cat: string) => {
  switch (cat) {
    case 'japanese':
      return { bg: 'bg-amber-100', text: 'text-amber-800', gradient: 'from-amber-50 to-stone-50' };
    case 'western':
      return { bg: 'bg-orange-100', text: 'text-orange-800', gradient: 'from-orange-50 to-stone-50' };
    case 'chinese':
      return { bg: 'bg-red-100', text: 'text-red-800', gradient: 'from-red-50 to-stone-50' };
    case 'sweets':
      return { bg: 'bg-pink-100', text: 'text-pink-800', gradient: 'from-pink-50 to-stone-50' };
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

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await getLesson(id);

  if (!lesson) {
    notFound();
  }

  const catStyle = getCategoryStyle(lesson.category);
  const diffStyle = getDifficultyStyle(lesson.difficulty);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className={`bg-gradient-to-br ${catStyle.gradient} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/lessons" className="inline-flex items-center text-stone-600 hover:text-emerald-700 mb-4 transition">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            レッスン一覧に戻る
          </Link>
          <div className="flex gap-2 mb-4">
            <span className={`${catStyle.bg} ${catStyle.text} text-sm px-3 py-1 rounded-full font-medium`}>
              {lesson.category_label}
            </span>
            <span className={`${diffStyle.bg} ${diffStyle.text} text-sm px-3 py-1 rounded-full font-medium`}>
              {lesson.difficulty_label}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800">{lesson.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-stone-100 p-8">
                <h2 className="text-xl font-bold text-stone-800 mb-4">レッスン内容</h2>
                <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">{lesson.description}</p>
              </div>
            </div>

            {/* Sidebar - Schedules (Client Component) */}
            <div className="lg:col-span-1">
              <ScheduleSidebar lesson={lesson} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
