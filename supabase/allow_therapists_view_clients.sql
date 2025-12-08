-- Allow therapists to view user data (email, etc.) for clients who have bookings with them
CREATE POLICY "Therapists can view their clients" ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.therapist_profiles tp ON b.therapist_id = tp.id
    WHERE b.client_id = public.users.id
    AND tp.user_id = auth.uid()
  )
);
