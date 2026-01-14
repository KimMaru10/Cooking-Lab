export type InstructorSchedule = {
  id: number;
  lesson: {
    id: number;
    title: string;
    category: string;
    category_label: string;
  };
  start_at: string;
  end_at: string;
  capacity: number;
  reservation_count: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  status_label: string;
  can_start: boolean;
  reservations: InstructorReservation[];
};

export type InstructorReservation = {
  id: number;
  user: {
    id: number;
    name: string;
  };
  status: 'reserved' | 'cancelled' | 'attended' | 'absent';
  status_label: string;
};
