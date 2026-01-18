
export type Grade = 'Grade 9' | 'Grade 10';

export type MaterialType = 'Past Paper' | 'Note';

export interface Material {
  id: string;
  title: string;
  description: string;
  grade: Grade;
  subject: string;
  type: MaterialType;
  fileUrl: string;
  fileName: string;
  year?: string; // Optional year for past papers
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  likes?: number;
}

export interface Comment {
  id: string;
  blog_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Todo {
  id: string;
  user_id: string;
  text: string;
  is_completed: boolean;
  tag: 'Urgent' | 'Study' | 'School' | 'Personal';
  created_at: string;
}

export const SUBJECTS = [
  'Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'English',
  'Urdu',
  'Pakistan Studies',
  'Islamiyat',
  'Computer Science'
];

export const YEARS = Array.from({ length: 2025 - 2012 + 1 }, (_, i) => (2012 + i).toString()).reverse();

export interface McqResult {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at?: string;
}
