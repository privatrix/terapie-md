-- Create booking_messages table
CREATE TABLE public.booking_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.booking_messages ENABLE ROW LEVEL SECURITY;

-- Policies

-- Users can view messages for their own bookings
CREATE POLICY "Users can view messages for own bookings" ON public.booking_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT client_id FROM public.bookings WHERE id = booking_id
      UNION
      SELECT user_id FROM public.therapist_profiles WHERE id = (
        SELECT therapist_id FROM public.bookings WHERE id = booking_id
      )
    )
  );

-- Users can insert messages for their own bookings
CREATE POLICY "Users can insert messages for own bookings" ON public.booking_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT client_id FROM public.bookings WHERE id = booking_id
      UNION
      SELECT user_id FROM public.therapist_profiles WHERE id = (
        SELECT therapist_id FROM public.bookings WHERE id = booking_id
      )
    )
  );
