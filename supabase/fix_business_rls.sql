-- Allow admins to view all business profiles
CREATE POLICY "Admins can view all business profiles" ON public.business_profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Allow admins to update all business profiles
CREATE POLICY "Admins can update all business profiles" ON public.business_profiles
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Allow admins to insert business profiles
CREATE POLICY "Admins can insert business profiles" ON public.business_profiles
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Allow admins to delete business profiles
CREATE POLICY "Admins can delete business profiles" ON public.business_profiles
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );
