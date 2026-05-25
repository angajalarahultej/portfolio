-- Supabase Database Schema for Developer Portfolio
-- Copy and paste this script into the Supabase SQL Editor to initialize all tables, storage, and RLS policies.

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    title text not null,
    about text not null,
    avatar_url text,
    github_url text,
    linkedin_url text,
    email text,
    phone text,
    location text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Seed initial default profile (will be updated via admin dashboard)
insert into public.profiles (id, name, title, about, github_url, linkedin_url, email, location)
values (
    '00000000-0000-0000-0000-000000000000',
    'John Doe',
    'Senior Software Engineer',
    'I build high-performance web applications and design clean, scalable systems. Experienced in TypeScript, React, Next.js, and Node.js.',
    'https://github.com',
    'https://linkedin.com',
    'john.doe@example.com',
    'San Francisco, CA'
)
on conflict (id) do nothing;


-- 2. Education Table
create table if not exists public.education (
    id uuid primary key default uuid_generate_v4(),
    institution text not null,
    degree text not null,
    field_of_study text,
    start_date text not null,
    end_date text,
    grade text,
    description text,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);


-- 3. Experience & Internships Table
create table if not exists public.experience (
    id uuid primary key default uuid_generate_v4(),
    company text not null,
    role text not null,
    type text not null check (type in ('job', 'internship')),
    start_date text not null,
    end_date text,
    location text,
    description text, -- Store bullet points separated by newlines
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);


-- 4. Projects Table
create table if not exists public.projects (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text not null,
    long_description text,
    image_url text,
    github_url text,
    live_url text,
    tags text[] default '{}',
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);


-- 5. Certifications Table
create table if not exists public.certifications (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    issuer text not null,
    issue_date text not null,
    expiration_date text,
    credential_id text,
    credential_url text,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);


-- 6. Skills Table
create table if not exists public.skills (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    category text not null, -- e.g. 'Frontend', 'Backend', 'Tools', 'Languages'
    proficiency integer not null check (proficiency >= 0 and proficiency <= 100),
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);


-- 7. Resumes Table
create table if not exists public.resumes (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    file_url text not null,
    is_active boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now())
);


-- 8. Messages Table (for Contact submissions)
create table if not exists public.messages (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null,
    subject text,
    message text not null,
    is_read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now())
);


-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.skills enable row level security;
alter table public.resumes enable row level security;
alter table public.messages enable row level security;


-- Set up RLS Policies

-- Public Read access policies
create policy "Allow public read on profiles" on public.profiles for select using (true);
create policy "Allow public read on education" on public.education for select using (true);
create policy "Allow public read on experience" on public.experience for select using (true);
create policy "Allow public read on projects" on public.projects for select using (true);
create policy "Allow public read on certifications" on public.certifications for select using (true);
create policy "Allow public read on skills" on public.skills for select using (true);
create policy "Allow public read on resumes" on public.resumes for select using (true);

-- Authenticated User (Admin) Write access policies
create policy "Allow auth write on profiles" on public.profiles for all using (auth.role() = 'authenticated');
create policy "Allow auth write on education" on public.education for all using (auth.role() = 'authenticated');
create policy "Allow auth write on experience" on public.experience for all using (auth.role() = 'authenticated');
create policy "Allow auth write on projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Allow auth write on certifications" on public.certifications for all using (auth.role() = 'authenticated');
create policy "Allow auth write on skills" on public.skills for all using (auth.role() = 'authenticated');
create policy "Allow auth write on resumes" on public.resumes for all using (auth.role() = 'authenticated');

-- Contact Messages policies: Public can only insert, Admin can perform all actions
create policy "Allow public insert on messages" on public.messages for insert with check (true);
create policy "Allow auth all on messages" on public.messages for all using (auth.role() = 'authenticated');


-- =========================================================================================
-- STORAGE BUCKETS SETUP
-- Note: Supabase creates buckets inside the `storage.buckets` and files in `storage.objects`.
-- Below we insert buckets if they don't exist and define RLS policies for them.
-- =========================================================================================

-- Create buckets
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('projects', 'projects', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policies: Public Read access for files in these buckets
create policy "Public Access to Resumes" on storage.objects for select using (bucket_id = 'resumes');
create policy "Public Access to Projects" on storage.objects for select using (bucket_id = 'projects');
create policy "Public Access to Avatars" on storage.objects for select using (bucket_id = 'avatars');

-- Storage policies: Authenticated user (Admin) Upload/Update/Delete access
create policy "Admin Upload Resumes" on storage.objects for insert with check (bucket_id = 'resumes' and auth.role() = 'authenticated');
create policy "Admin Delete Resumes" on storage.objects for delete using (bucket_id = 'resumes' and auth.role() = 'authenticated');
create policy "Admin Update Resumes" on storage.objects for update using (bucket_id = 'resumes' and auth.role() = 'authenticated');

create policy "Admin Upload Projects" on storage.objects for insert with check (bucket_id = 'projects' and auth.role() = 'authenticated');
create policy "Admin Delete Projects" on storage.objects for delete using (bucket_id = 'projects' and auth.role() = 'authenticated');
create policy "Admin Update Projects" on storage.objects for update using (bucket_id = 'projects' and auth.role() = 'authenticated');

create policy "Admin Upload Avatars" on storage.objects for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "Admin Delete Avatars" on storage.objects for delete using (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "Admin Update Avatars" on storage.objects for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');
