-- Allow public to view business profiles that have active offers, even if not verified
CREATE POLICY "Public can view businesses with active offers" ON public.business_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.offers 
      WHERE offers.business_id = public.business_profiles.id 
      AND offers.active = TRUE
    )
  );
