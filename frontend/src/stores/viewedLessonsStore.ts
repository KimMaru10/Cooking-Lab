import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewedLesson } from '@/types/viewedLesson';

type ViewedLessonsStore = {
  viewedLessons: ViewedLesson[];
  addViewedLesson: (lesson: Omit<ViewedLesson, 'viewedAt'>) => void;
  clearViewedLessons: () => void;
};

export const useViewedLessonsStore = create<ViewedLessonsStore>()(
  persist(
    (set) => ({
      viewedLessons: [],
      addViewedLesson: (lesson) =>
        set((state) => {
          const filtered = state.viewedLessons.filter((l) => l.id !== lesson.id);
          return {
            viewedLessons: [
              {
                ...lesson,
                viewedAt: new Date().toISOString(),
              },
              ...filtered,
            ].slice(0, 5), // 最大5件保存
          };
        }),
      clearViewedLessons: () => set({ viewedLessons: [] }),
    }),
    {
      name: 'viewed-lessons-storage',
    }
  )
);
