-- Migration: create messages table and add admin policies

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_email text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Admin policies for messages
CREATE POLICY "admin can select messages" ON public.messages FOR SELECT USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can update messages" ON public.messages FOR UPDATE USING (auth.email() = 'rahultej2610@gmail.com');
CREATE POLICY "admin can delete messages" ON public.messages FOR DELETE USING (auth.email() = 'rahultej2610@gmail.com');

-- Allow anyone to insert a message (contact form)
CREATE POLICY "anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Grant service_role full access
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
