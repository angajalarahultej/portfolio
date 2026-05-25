-- Migration: add profiles table

CREATE TABLE IF NOT EXISTS public.profiles (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text,
  role text,
  bio text,
  image_url text,
  created_at timestamptz DEFAULT now()
);
