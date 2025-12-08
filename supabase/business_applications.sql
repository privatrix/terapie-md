-- Business Applications Table
CREATE TABLE IF NOT EXISTS public.business_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  cui TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  description TEXT,
  website TEXT,
  location TEXT NOT NULL,
  documents JSONB DEFAULT '[]', -- Array of document URLs
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

-- Enable RLS
ALTER TABLE public.business_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit applications
CREATE POLICY "Anyone can submit business application" ON public.business_applications
  FOR INSERT WITH CHECK (TRUE);

-- Allow admins to view all applications
CREATE POLICY "Admins can view all business applications" ON public.business_applications
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Allow admins to update applications
CREATE POLICY "Admins can update business applications" ON public.business_applications
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Allow admins to delete applications
CREATE POLICY "Admins can delete business applications" ON public.business_applications
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Index for better performance
CREATE INDEX idx_business_applications_status ON public.business_applications(status);
