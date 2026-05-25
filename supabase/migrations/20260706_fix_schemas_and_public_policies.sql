-- Migration: Fix all table schemas to match TypeScript types,
-- add missing columns, fix messages table, add public read policies,
-- and add admin policies for profiles.

-- ============================================================
-- 1. FIX EDUCATION TABLE
-- ============================================================
-- Add missing columns
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS institution text;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS degree text;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS field_of_study text;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS start_date text;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS end_date text;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS grade text;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS description text;

-- Copy data from old columns if they exist
UPDATE public.education SET institution = school WHERE institution IS NULL AND school IS NOT NULL;
UPDATE public.education SET field_of_study = field WHERE field_of_study IS NULL AND field IS NOT NULL;
UPDATE public.education SET start_date = start_year::text WHERE start_date IS NULL AND start_year IS NOT NULL;
UPDATE public.education SET end_date = end_year::text WHERE end_date IS NULL AND end_year IS NOT NULL;

-- ============================================================
-- 2. FIX EXPERIENCE TABLE
-- ============================================================
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS type text DEFAULT 'job';
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS location text;

-- ============================================================
-- 3. FIX PROJECTS TABLE
-- ============================================================
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS long_description text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_url text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS live_url text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Copy old columns
UPDATE public.projects SET github_url = repo_url WHERE github_url IS NULL AND repo_url IS NOT NULL;
UPDATE public.projects SET live_url = url WHERE live_url IS NULL AND url IS NOT NULL;

-- ============================================================
-- 4. FIX CERTIFICATIONS TABLE
-- ============================================================
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS issue_date text;
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS expiration_date text;
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS credential_id text;

-- Copy old column
UPDATE public.certifications SET issue_date = issued_at::text WHERE issue_date IS NULL AND issued_at IS NOT NULL;

-- ============================================================
-- 5. FIX SKILLS TABLE
-- ============================================================
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS category text DEFAULT 'General';

-- ============================================================
-- 6. FIX PROFILES TABLE - add missing columns
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS about text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text;

-- Copy old columns
UPDATE public.profiles SET title = role WHERE title IS NULL AND role IS NOT NULL;
UPDATE public.profiles SET about = bio WHERE about IS NULL AND bio IS NOT NULL;
UPDATE public.profiles SET avatar_url = image_url WHERE avatar_url IS NULL AND image_url IS NOT NULL;

-- ============================================================
-- 7. DROP AND RECREATE MESSAGES TABLE with correct schema
-- ============================================================
DROP TABLE IF EXISTS public.messages CASCADE;

CREATE TABLE public.messages (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 8. PUBLIC READ POLICIES (anonymous users can view portfolio)
-- ============================================================

-- Profiles
CREATE POLICY "public can read profiles" ON public.profiles FOR SELECT USING (true);

-- Education
CREATE POLICY "public can read education" ON public.education FOR SELECT USING (true);

-- Experience
CREATE POLICY "public can read experience" ON public.experience FOR SELECT USING (true);

-- Projects
CREATE POLICY "public can read projects" ON public.projects FOR SELECT USING (true);

-- Certifications
CREATE POLICY "public can read certifications" ON public.certifications FOR SELECT USING (true);

-- Skills
CREATE POLICY "public can read skills" ON public.skills FOR SELECT USING (true);

-- Resumes
CREATE POLICY "public can read resumes" ON public.resumes FOR SELECT USING (true);

-- ============================================================
-- 9. PUBLIC INSERT POLICY for contact form messages
-- ============================================================
CREATE POLICY "anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- ============================================================
-- 10. ADMIN POLICIES for profiles table
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin can select profiles" ON public.profiles FOR SELECT USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can insert profiles" ON public.profiles FOR INSERT WITH CHECK (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can update profiles" ON public.profiles FOR UPDATE USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can delete profiles" ON public.profiles FOR DELETE USING (auth.email() = 'rahultej2610@gmail.com');

-- ============================================================
-- 11. ADMIN POLICIES for messages table
-- ============================================================
CREATE POLICY "admin can select messages" ON public.messages FOR SELECT USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can update messages" ON public.messages FOR UPDATE USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can delete messages" ON public.messages FOR DELETE USING (auth.email() = 'rahultej2610@gmail.com');

-- ============================================================
-- 12. Ensure service_role has full access
-- ============================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
