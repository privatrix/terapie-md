-- Fix RLS for Business Profiles
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business owners can view own profile" ON public.business_profiles;
CREATE POLICY "Business owners can view own profile" ON public.business_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Fix RLS for Bookings (Ensure Business Access)
DROP POLICY IF EXISTS "Businesses can view their own bookings" ON public.bookings;
CREATE POLICY "Businesses can view their own bookings" ON public.bookings
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.business_profiles WHERE id = business_id
    )
  );

-- Fix RLS for Booking Messages (Comprehensive)
DROP POLICY IF EXISTS "Users can view messages for own bookings" ON public.booking_messages;
DROP POLICY IF EXISTS "Users can insert messages for own bookings" ON public.booking_messages;

CREATE POLICY "Users can view messages for own bookings" ON public.booking_messages
  FOR SELECT USING (
    -- User is the Client
    auth.uid() = (SELECT client_id FROM public.bookings WHERE id = booking_id)
    OR
    -- User is the Therapist
    auth.uid() IN (
      SELECT user_id FROM public.therapist_profiles WHERE id = (
        SELECT therapist_id FROM public.bookings WHERE id = booking_id
      )
    )
    OR
    -- User is the Business Owner
    auth.uid() IN (
      SELECT user_id FROM public.business_profiles WHERE id = (
        SELECT business_id FROM public.bookings WHERE id = booking_id
      )
    )
  );

CREATE POLICY "Users can insert messages for own bookings" ON public.booking_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND (
      -- User is the Client
      auth.uid() = (SELECT client_id FROM public.bookings WHERE id = booking_id)
      OR
      -- User is the Therapist
      auth.uid() IN (
        SELECT user_id FROM public.therapist_profiles WHERE id = (
          SELECT therapist_id FROM public.bookings WHERE id = booking_id
        )
      )
      OR
      -- User is the Business Owner
      auth.uid() IN (
        SELECT user_id FROM public.business_profiles WHERE id = (
          SELECT business_id FROM public.bookings WHERE id = booking_id
        )
      )
    )
  );
