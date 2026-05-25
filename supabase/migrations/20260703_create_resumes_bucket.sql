-- Migration: create 'resumes' storage bucket

INSERT INTO storage.buckets (id, name, public)
VALUES (gen_random_uuid(), 'resumes', false);
