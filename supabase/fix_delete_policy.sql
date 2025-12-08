-- Allow admins to delete therapist profiles
CREATE POLICY "Admins can delete profiles" ON public.therapist_profiles
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Allow admins to delete applications (optional, but good for cleanup)
CREATE POLICY "Admins can delete applications" ON public.therapist_applications
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );
