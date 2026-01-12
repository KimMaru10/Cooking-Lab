import { Schedule } from './lesson';

export type Reservation = {
  id: number;
  user_id: number;
  schedule_id: number;
  schedule?: Schedule & {
    lesson?: {
      id: number;
      title: string;
      category: string;
      category_label: string;
    };
  };
  ticket_id: number;
  status: string;
  status_label: string;
  reserved_at: string;
  cancelled_at: string | null;
  created_at: string;
};

export type Ticket = {
  id: number;
  user_id: number;
  plan: string;
  plan_label: string;
  remaining_count: number;
  purchased_at: string;
  expires_at: string;
  is_expired: boolean;
  is_valid: boolean;
  created_at: string;
};
