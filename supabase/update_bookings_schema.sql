
-- Add offer_id and business_id to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE;

-- Make therapist_id nullable since a booking might be for a business
ALTER TABLE public.bookings 
ALTER COLUMN therapist_id DROP NOT NULL;

-- Update RLS policies to allow businesses to view their bookings
CREATE POLICY "Businesses can view their own bookings"
ON public.bookings
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.business_profiles WHERE id = business_id
  )
);

-- Allow businesses to update their own bookings (e.g. status)
CREATE POLICY "Businesses can update their own bookings"
ON public.bookings
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM public.business_profiles WHERE id = business_id
  )
);
