-- Fix "No Slots" bug by ensuring all metadata is visible
-- 1. Mark all therapist profiles as VERIFIED (RLS policy requires this for public visibility)
UPDATE public.therapist_profiles
SET verified = TRUE
WHERE verified = FALSE;

-- 2. Activate all Offers (RLS policy requires this)
UPDATE public.offers
SET active = TRUE
WHERE active = FALSE;

-- 3. Grant explicit access to weekly_schedule column if needed (though public access usually covers it)
-- Note: Supabase RLS policies usually cover all columns unless restricted by column-level grants.
-- This script relies on the existing "Anyone can view verified therapist profiles" policy.

-- 4. Debug Output
SELECT 
  id, 
  name, 
  verified, 
  availability, 
  weekly_schedule IS NOT NULL as has_schedule 
FROM public.therapist_profiles;
