
-- Fix infinite recursion by simplifying policies

-- 1. Reset Business Profiles Policies
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to be safe
DROP POLICY IF EXISTS "Business profiles are viewable by everyone" ON public.business_profiles;
DROP POLICY IF EXISTS "Businesses can update own profile" ON public.business_profiles;
DROP POLICY IF EXISTS "Businesses can insert own profile" ON public.business_profiles;
DROP POLICY IF EXISTS "Public view verified businesses" ON public.business_profiles;
DROP POLICY IF EXISTS "Owners can view their own business profile" ON public.business_profiles;

-- Re-create simple policies
-- SELECT: Public can see ALL business profiles (needed for joins)
CREATE POLICY "Public read business profiles"
ON public.business_profiles
FOR SELECT
USING (true);

-- UPDATE: Only owner can update
CREATE POLICY "Owner update business profiles"
ON public.business_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- INSERT: Only owner can insert
CREATE POLICY "Owner insert business profiles"
ON public.business_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);


-- 2. Reset Therapist Profiles Policies (just in case)
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Therapist profiles are viewable by everyone" ON public.therapist_profiles;
DROP POLICY IF EXISTS "Therapists can update own profile" ON public.therapist_profiles;
DROP POLICY IF EXISTS "Therapists can insert own profile" ON public.therapist_profiles;

CREATE POLICY "Public read therapist profiles"
ON public.therapist_profiles
FOR SELECT
USING (true);

CREATE POLICY "Owner update therapist profiles"
ON public.therapist_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Owner insert therapist profiles"
ON public.therapist_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);


-- 3. Reset Offers Policies
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public offers are viewable by everyone" ON public.offers;
DROP POLICY IF EXISTS "Providers can view their own offers" ON public.offers;
DROP POLICY IF EXISTS "Providers can insert their own offers" ON public.offers;
DROP POLICY IF EXISTS "Providers can update their own offers" ON public.offers;
DROP POLICY IF EXISTS "Providers can delete their own offers" ON public.offers;

-- SELECT: Public can see active offers
CREATE POLICY "Public read active offers"
ON public.offers
FOR SELECT
USING (active = true);

-- SELECT: Providers can see their own offers (even inactive)
-- We use a direct check on the profiles tables. Since we set their SELECT policy to TRUE above, this should not recurse.
CREATE POLICY "Providers read own offers"
ON public.offers
FOR SELECT
USING (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);

-- INSERT: Providers can insert
CREATE POLICY "Providers insert offers"
ON public.offers
FOR INSERT
WITH CHECK (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);

-- UPDATE: Providers can update
CREATE POLICY "Providers update offers"
ON public.offers
FOR UPDATE
USING (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);

-- DELETE: Providers can delete
CREATE POLICY "Providers delete offers"
ON public.offers
FOR DELETE
USING (
  (auth.uid() IN (SELECT user_id FROM public.therapist_profiles WHERE id = provider_id))
  OR
  (auth.uid() IN (SELECT user_id FROM public.business_profiles WHERE id = business_id))
);
