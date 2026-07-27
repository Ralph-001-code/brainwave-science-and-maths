import { createClient } from "@supabase/supabase-js";
import type { YearId, Programme, CheckpointStage, IgcseSubjectId } from "./quizData";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Role = "student" | "teacher" | "guardian";

export type School = {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  created_by: string | null;
  created_at: string;
};

export type FriendshipStatus = "pending" | "accepted" | "declined";

export type Friendship = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  avatar_config: Record<string, unknown> | null;
  year_id: YearId;
  xp: number;
  streak: number;
  last_active: string | null;
  email_updates: boolean;
  programme: Programme;
  checkpoint_stage: CheckpointStage | null;
  igcse_subjects: IgcseSubjectId[];
  timer_enabled: boolean;
  timer_duration: number;
  role: Role;
  school_id: string | null;
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  topic: string;
  year_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
  subject: string;
  programme: string;
};

export type Certificate = {
  id: string;
  user_id: string;
  programme: string;
  stage: string | null;
  title: string;
  student_name: string;
  score: number;
  issued_at: string;
};

export type PathwayProgress = {
  id: string;
  user_id: string;
  programme: string;
  stage: string | null;
  topic_id: string;
  best_score: number;
  completed: boolean;
  updated_at: string;
};

export type LevelProgress = {
  id: string;
  user_id: string;
  year_id: string;
  topic: string;
  completed: boolean;
  best_score: number;
  updated_at: string;
};
