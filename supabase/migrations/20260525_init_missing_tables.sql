-- Migration: create all missing tables for portfolio

-- certifications
CREATE TABLE IF NOT EXISTS public.certifications (
  id          bigint   PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name        text,
  issuer      text,
  issued_at   date,
  credential_url text,
  display_order int8,
  created_at  timestamptz DEFAULT now()
);

-- experience
CREATE TABLE IF NOT EXISTS public.experience (
  id          bigint   PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  company     text,
  role        text,
  start_date  date,
  end_date    date,
  description text,
  display_order int8,
  created_at  timestamptz DEFAULT now()
);

-- projects
CREATE TABLE IF NOT EXISTS public.projects (
  id          bigint   PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title       text,
  description text,
  url         text,
  repo_url    text,
  display_order int8,
  created_at  timestamptz DEFAULT now()
);

-- skills
CREATE TABLE IF NOT EXISTS public.skills (
  id          bigint   PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name        text,
  proficiency int,
  display_order int8,
  created_at  timestamptz DEFAULT now()
);

-- education (includes optional display_order)
CREATE TABLE IF NOT EXISTS public.education (
  id            bigint   PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school        text,
  degree        text,
  field         text,
  start_year    int,
  end_year      int,
  display_order int8,
  created_at    timestamptz DEFAULT now()
);
