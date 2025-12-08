-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Businesses can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Businesses can update their own bookings" ON public.bookings;

-- Re-create policies
CREATE POLICY "Businesses can view their own bookings"
ON public.bookings
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.business_profiles WHERE id = business_id
  )
);

CREATE POLICY "Businesses can update their own bookings"
ON public.bookings
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM public.business_profiles WHERE id = business_id
  )
);

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
