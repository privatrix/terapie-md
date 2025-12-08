
-- Admin Policies (Append to existing schema)

-- Allow admins to view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Allow admins to update all users (e.g. to change roles)
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Allow admins to view/update all therapist profiles
CREATE POLICY "Admins can view all profiles" ON public.therapist_profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

CREATE POLICY "Admins can update all profiles" ON public.therapist_profiles
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert profiles" ON public.therapist_profiles
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Allow admins to view/update all applications
CREATE POLICY "Admins can view all applications" ON public.therapist_applications
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

CREATE POLICY "Admins can update all applications" ON public.therapist_applications
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );
