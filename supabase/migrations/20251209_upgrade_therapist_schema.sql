-- Add specializations array and medical_code to therapist_profiles
ALTER TABLE public.therapist_profiles
ADD COLUMN IF NOT EXISTS specializations text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS medical_code text;

-- Add same columns to therapist_applications for data consistency
ALTER TABLE public.therapist_applications
ADD COLUMN IF NOT EXISTS specializations text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS medical_code text;

-- Optional: Add a check constraint for specializations (can be done in app logic too)
-- ALTER TABLE public.therapist_profiles ADD CONSTRAINT check_specializations 
-- CHECK (specializations <@ ARRAY['Psiholog Clinician', 'Psihoterapeut', 'Consilier', 'Coach', 'Psihiatru']);
