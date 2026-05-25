-- Migration: create missing storage buckets, storage policies, and seed default profile

-- ============================================================
-- 1. CREATE MISSING STORAGE BUCKETS
-- ============================================================

-- Projects bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Make resumes bucket public (it was created as private earlier)
UPDATE storage.buckets SET public = true WHERE id = 'resumes';

-- ============================================================
-- 2. STORAGE RLS POLICIES
-- ============================================================

-- Public read access for all buckets
CREATE POLICY "Public Access to Resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
CREATE POLICY "Public Access to Projects" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Public Access to Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Admin upload/update/delete for resumes
CREATE POLICY "Admin Upload Resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Resumes" ON storage.objects FOR DELETE USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update Resumes" ON storage.objects FOR UPDATE USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Admin upload/update/delete for projects
CREATE POLICY "Admin Upload Projects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Projects" ON storage.objects FOR DELETE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update Projects" ON storage.objects FOR UPDATE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

-- Admin upload/update/delete for avatars
CREATE POLICY "Admin Upload Avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update Avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- ============================================================
-- 3. SEED DEFAULT PROFILE (if none exists)
-- ============================================================
INSERT INTO public.profiles (name, title, about, email, location)
SELECT 'Your Name', 'Developer', 'Update your bio in the admin dashboard.', 'rahultej2610@gmail.com', 'India'
WHERE NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1);
