create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  name text,
  title text,
  about text,
  avatar_url text,
  github_url text,
  linkedin_url text,
  email text,
  phone text,
  location text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Allow admin (by email) to select and update own profile
create policy "admin can select own profile" on public.profiles
  for select using (auth.email() = 'rahultej2610@gmail.com' and auth.uid() = id);

create policy "admin can update own profile" on public.profiles
  for update using (auth.email() = 'rahultej2610@gmail.com' and auth.uid() = id);
