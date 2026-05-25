create table public.profiles (
  id bigint primary key generated always as identity,
  name text,
  role text,
  bio text,
  image_url text,
  created_at timestamptz default now()
);

-- Insert a starter row (adjust values as needed)
insert into public.profiles (name, role, bio, image_url) values (
  'Rahul',
  'Full Stack Developer',
  'Highly motivated software engineer with 5+ years experience.',
  ''
);
