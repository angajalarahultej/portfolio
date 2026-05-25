-- Migration: Align resumes bucket ID with its name
-- Currently, the resumes bucket has a generated UUID for its 'id' column,
-- whereas the Supabase JS Storage client references it by its name string ('resumes').
-- This updates the bucket ID to be 'resumes' to match projects and avatars buckets.

UPDATE storage.buckets SET id = 'resumes' WHERE name = 'resumes';
