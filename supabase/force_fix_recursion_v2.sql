
-- Force fix infinite recursion by dropping ALL policies on relevant tables

DO $$ 
DECLARE 
    pol record;
BEGIN 
    -- 1. Drop ALL policies on business_profiles
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'business_profiles' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.business_profiles', pol.policyname);
    END LOOP;

    -- 2. Drop ALL policies on offers
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'offers' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.offers', pol.policyname);
    END LOOP;
    
    -- 3. Drop ALL policies on therapist_profiles (just to be safe)
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'therapist_profiles' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.therapist_profiles', pol.policyname);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;

-- Re-create simple, non-recursive policies

-- BUSINESS PROFILES
CREATE POLICY "Public read business profiles" ON public.business_profiles FOR SELECT USING (true);
CREATE POLICY "Owner update business profiles" ON public.business_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner insert business profiles" ON public.business_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- THERAPIST PROFILES
CREATE POLICY "Public read therapist profiles" ON public.therapist_profiles FOR SELECT USING (true);
CREATE POLICY "Owner update therapist profiles" ON public.therapist_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner insert therapist profiles" ON public.therapist_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- OFFERS
CREATE POLICY "Public read active offers" ON public.offers FOR SELECT USING (active = true);

-- Providers can see their own offers (even inactive)
CREATE POLICY "Providers read own offers" ON public.offers FOR SELECT USING (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);

-- Providers can insert offers
CREATE POLICY "Providers insert offers" ON public.offers FOR INSERT WITH CHECK (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);

-- Providers can update offers
CREATE POLICY "Providers update offers" ON public.offers FOR UPDATE USING (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);

-- Providers can delete offers
CREATE POLICY "Providers delete offers" ON public.offers FOR DELETE USING (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);
