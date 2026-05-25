export interface Profile {
  id: string;
  name: string;
  title: string;
  about: string;
  avatar_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  created_at?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string | null;
  start_date: string;
  end_date?: string | null;
  grade?: string | null;
  description?: string | null;
  display_order: number;
  created_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  type: 'job' | 'internship';
  start_date: string;
  end_date?: string | null;
  location?: string | null;
  description?: string | null; // Bullet points separated by newlines
  display_order: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string | null;
  image_url?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  tags: string[];
  display_order: number;
  created_at?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiration_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  display_order: number;
  created_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string; // e.g. 'Frontend', 'Backend', 'Tools', 'Languages'
  proficiency: number; // 0 to 100
  display_order: number;
  created_at?: string;
}

export interface Resume {
  id: string;
  name: string;
  file_url: string;
  is_active: boolean;
  created_at?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  is_read: boolean;
  created_at?: string;
}
