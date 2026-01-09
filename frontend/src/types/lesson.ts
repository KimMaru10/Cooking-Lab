export type Lesson = {
  id: number;
  title: string;
  description: string;
  category: string;
  category_label: string;
  difficulty: string;
  difficulty_label: string;
  created_at: string;
  updated_at: string;
};

export type LessonsResponse = {
  data: Lesson[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};
