-- Add weekly_schedule column to therapist_profiles
ALTER TABLE public.therapist_profiles
ADD COLUMN weekly_schedule JSONB DEFAULT '{}';

-- Comment on column
COMMENT ON COLUMN public.therapist_profiles.weekly_schedule IS 'Stores day-specific availability, e.g. {"monday": {"active": true, "slots": ["09:00"]}}';
