
-- Enable RLS on offers table
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active offers
CREATE POLICY "Public offers are viewable by everyone"
ON public.offers
FOR SELECT
USING (active = true);

-- Allow providers (therapists and businesses) to view their own offers (even inactive ones)
CREATE POLICY "Providers can view their own offers"
ON public.offers
FOR SELECT
USING (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);

-- Allow providers to insert their own offers
CREATE POLICY "Providers can insert their own offers"
ON public.offers
FOR INSERT
WITH CHECK (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);

-- Allow providers to update their own offers
CREATE POLICY "Providers can update their own offers"
ON public.offers
FOR UPDATE
USING (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);

-- Allow providers to delete their own offers
CREATE POLICY "Providers can delete their own offers"
ON public.offers
FOR DELETE
USING (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);
