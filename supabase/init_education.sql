-- Supabase SQL: create the missing education table (and optional display_order column)

CREATE TABLE IF NOT EXISTS public.education (
  id          bigint   PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school      text,
  degree      text,
  field       text,
  start_year  int,
  end_year    int,
  display_order int8,            -- optional ordering column used by UI (can be null)
  created_at  timestamptz DEFAULT now()
);
