
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
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
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
