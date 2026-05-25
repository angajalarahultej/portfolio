-- Migration: add resumes table

CREATE TABLE IF NOT EXISTS public.resumes (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text,
  file_url text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
