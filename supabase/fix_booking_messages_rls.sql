-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages for own bookings" ON public.booking_messages;
DROP POLICY IF EXISTS "Users can insert messages for own bookings" ON public.booking_messages;

-- Re-create policies including business support
CREATE POLICY "Users can view messages for own bookings" ON public.booking_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT client_id FROM public.bookings WHERE id = booking_id
      UNION
      SELECT user_id FROM public.therapist_profiles WHERE id = (
        SELECT therapist_id FROM public.bookings WHERE id = booking_id
      )
      UNION
      SELECT user_id FROM public.business_profiles WHERE id = (
        SELECT business_id FROM public.bookings WHERE id = booking_id
      )
    )
  );

CREATE POLICY "Users can insert messages for own bookings" ON public.booking_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT client_id FROM public.bookings WHERE id = booking_id
      UNION
      SELECT user_id FROM public.therapist_profiles WHERE id = (
        SELECT therapist_id FROM public.bookings WHERE id = booking_id
      )
       UNION
      SELECT user_id FROM public.business_profiles WHERE id = (
        SELECT business_id FROM public.bookings WHERE id = booking_id
      )
    )
  );
