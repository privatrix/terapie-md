-- Function to check if current user is admin (bypassing RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Contact Submissions
-- Check if policy exists before creating to avoid errors (or just drop and recreate)
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions
  FOR UPDATE USING (public.is_admin());

-- 2. Therapist Applications
DROP POLICY IF EXISTS "Admins can view therapist applications" ON public.therapist_applications;
CREATE POLICY "Admins can view therapist applications" ON public.therapist_applications
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update therapist applications" ON public.therapist_applications;
CREATE POLICY "Admins can update therapist applications" ON public.therapist_applications
  FOR UPDATE USING (public.is_admin());

-- 3. Users Table
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
CREATE POLICY "Admins can delete users" ON public.users
  FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update users" ON public.users;
CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (public.is_admin());

-- 4. Business Applications Table
CREATE TABLE IF NOT EXISTS public.business_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  cui TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  description TEXT,
  website TEXT,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

ALTER TABLE public.business_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit business application" ON public.business_applications;
CREATE POLICY "Anyone can submit business application" ON public.business_applications
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admins can view business applications" ON public.business_applications;
CREATE POLICY "Admins can view business applications" ON public.business_applications
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update business applications" ON public.business_applications;
CREATE POLICY "Admins can update business applications" ON public.business_applications
  FOR UPDATE USING (public.is_admin());
