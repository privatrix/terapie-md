-- Allow therapists to insert new offers
CREATE POLICY "Therapists can insert offers" ON public.offers
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.therapist_profiles WHERE id = provider_id
    )
  );

-- Allow therapists to update their own offers
CREATE POLICY "Therapists can update own offers" ON public.offers
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.therapist_profiles WHERE id = provider_id
    )
  );

-- Allow therapists to delete their own offers
CREATE POLICY "Therapists can delete own offers" ON public.offers
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.therapist_profiles WHERE id = provider_id
    )
  );
