-- Allow public read access to all therapist profiles (for development)
DROP POLICY IF EXISTS "Anyone can view verified therapist profiles" ON public.therapist_profiles;

CREATE POLICY "Anyone can view all therapist profiles" ON public.therapist_profiles
  FOR SELECT USING (TRUE);
