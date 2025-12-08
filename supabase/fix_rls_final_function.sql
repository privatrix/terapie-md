-- Create a secure function to check booking access
-- This function runs as the database owner (SECURITY DEFINER) to bypass RLS recursion issues
CREATE OR REPLACE FUNCTION public.can_access_booking(p_booking_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- Secure search path
AS $$
DECLARE
  v_current_user_id UUID;
BEGIN
  v_current_user_id := auth.uid();
  
  -- Return TRUE if the user is the client, therapist, or business owner of the booking
  RETURN EXISTS (
    SELECT 1 FROM public.bookings b
    LEFT JOIN public.therapist_profiles tp ON b.therapist_id = tp.id
    LEFT JOIN public.business_profiles bp ON b.business_id = bp.id
    WHERE b.id = p_booking_id
    AND (
      b.client_id = v_current_user_id -- User is the Client
      OR tp.user_id = v_current_user_id -- User is the Therapist
      OR bp.user_id = v_current_user_id -- User is the Business Owner
    )
  );
END;
$$;

-- Enable RLS on booking_messages just in case
ALTER TABLE public.booking_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing complex policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view messages for own bookings" ON public.booking_messages;
DROP POLICY IF EXISTS "Users can insert messages for own bookings" ON public.booking_messages;
DROP POLICY IF EXISTS "Access to booking messages" ON public.booking_messages;
DROP POLICY IF EXISTS "Unified booking messages policy" ON public.booking_messages;

-- Create a single, simple, robust policy using the secure function
CREATE POLICY "Unified booking messages policy" ON public.booking_messages
FOR ALL
USING ( public.can_access_booking(booking_id) )
WITH CHECK ( public.can_access_booking(booking_id) );

-- Also verify bookings RLS for businesses
DROP POLICY IF EXISTS "Businesses can view their own bookings" ON public.bookings;
CREATE POLICY "Businesses can view their own bookings" ON public.bookings
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.business_profiles WHERE id = business_id
  )
);
