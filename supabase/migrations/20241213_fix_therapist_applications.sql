-- Add missing columns to therapist_applications table
ALTER TABLE public.therapist_applications 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS medical_code TEXT,
ADD COLUMN IF NOT EXISTS specializations TEXT[] DEFAULT '{}';

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_therapist_applications_user_id ON public.therapist_applications(user_id);

-- Update RLS policies to allow users to see their own applications
DROP POLICY IF EXISTS "Users can view own applications" ON public.therapist_applications;
CREATE POLICY "Users can view own applications" ON public.therapist_applications
  FOR SELECT USING (auth.uid() = user_id);
