export type Instructor = {
  id: number;
  name: string;
};

export type Schedule = {
  id: number;
  lesson_id: number;
  instructor_id: number;
  instructor?: Instructor;
  lesson?: {
    id: number;
    title: string;
  };
  start_at: string;
  end_at: string;
  capacity: number;
  reservation_count: number;
  available_count: number;
  is_full: boolean;
  status: string;
  status_label?: string;
  created_at: string;
};

export type Lesson = {
  id: number;
  title: string;
  description: string;
  category: string;
  category_label: string;
  difficulty: string;
  difficulty_label: string;
  schedules?: Schedule[];
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
