-- Add 'business' to user_role enum
-- Note: Postgres doesn't support ALTER TYPE ... ADD VALUE inside a transaction block easily in some clients, 
-- but Supabase SQL editor handles it. If it fails, we might need to recreate the type, but let's try ADD VALUE first.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'business';

-- Create business_profiles table
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  cui TEXT, -- Unique Company Identifier (IDNO)
  description TEXT,
  website TEXT,
  location TEXT,
  logo_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Enable RLS on business_profiles
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_profiles
CREATE POLICY "Public can view verified business profiles" ON public.business_profiles
  FOR SELECT USING (verified = TRUE);

CREATE POLICY "Businesses can view own profile" ON public.business_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Businesses can update own profile" ON public.business_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Businesses can insert own profile" ON public.business_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update offers table to support businesses
ALTER TABLE public.offers 
ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.business_profiles(id) ON DELETE SET NULL;

-- Update offers RLS to allow businesses to manage their offers
CREATE POLICY "Businesses can insert offers" ON public.offers
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.business_profiles WHERE id = business_id
    )
  );

CREATE POLICY "Businesses can update own offers" ON public.offers
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.business_profiles WHERE id = business_id
    )
  );

CREATE POLICY "Businesses can delete own offers" ON public.offers
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.business_profiles WHERE id = business_id
    )
  );

-- Trigger for updated_at on business_profiles
CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
