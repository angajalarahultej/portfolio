-- Migration: enable RLS and add admin policies for all tables

-- Enable RLS on tables
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('education','experience','projects','certifications','skills','resumes','messages') LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
  END LOOP;
END $$;

-- Policies for each table allowing admin (by email) full access

-- admin email hard-coded in policies

-- Education policies
CREATE POLICY "admin can select education" ON public.education FOR SELECT USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can insert education" ON public.education FOR INSERT WITH CHECK (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can update education" ON public.education FOR UPDATE USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can delete education" ON public.education FOR DELETE USING (auth.email() = 'rahultej2610@gmail.com');

-- Experience policies
CREATE POLICY "admin can select experience" ON public.experience FOR SELECT USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can insert experience" ON public.experience FOR INSERT WITH CHECK (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can update experience" ON public.experience FOR UPDATE USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can delete experience" ON public.experience FOR DELETE USING (auth.email() = 'rahultej2610@gmail.com');

-- Projects policies
CREATE POLICY "admin can select projects" ON public.projects FOR SELECT USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can insert projects" ON public.projects FOR INSERT WITH CHECK (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can update projects" ON public.projects FOR UPDATE USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can delete projects" ON public.projects FOR DELETE USING (auth.email() = 'rahultej2610@gmail.com');

-- Certifications policies
CREATE POLICY "admin can select certifications" ON public.certifications FOR SELECT USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can insert certifications" ON public.certifications FOR INSERT WITH CHECK (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can update certifications" ON public.certifications FOR UPDATE USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can delete certifications" ON public.certifications FOR DELETE USING (auth.email() = 'rahultej2610@gmail.com');

-- Skills policies
CREATE POLICY "admin can select skills" ON public.skills FOR SELECT USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can insert skills" ON public.skills FOR INSERT WITH CHECK (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can update skills" ON public.skills FOR UPDATE USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can delete skills" ON public.skills FOR DELETE USING (auth.email() = 'rahultej2610@gmail.com');

-- Resumes policies
CREATE POLICY "admin can select resumes" ON public.resumes FOR SELECT USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can insert resumes" ON public.resumes FOR INSERT WITH CHECK (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can update resumes" ON public.resumes FOR UPDATE USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can delete resumes" ON public.resumes FOR DELETE USING (auth.email() = 'rahultej2610@gmail.com');

-- Grant service_role full access to bypass RLS
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
