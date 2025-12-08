
-- 1. Therapist Profiles: Allow public read
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Therapist profiles are viewable by everyone" ON public.therapist_profiles;
CREATE POLICY "Therapist profiles are viewable by everyone"
ON public.therapist_profiles
FOR SELECT
USING (true);

-- 2. Business Profiles: Allow public read
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business profiles are viewable by everyone" ON public.business_profiles;
CREATE POLICY "Business profiles are viewable by everyone"
ON public.business_profiles
FOR SELECT
USING (true);

-- 3. Offers: Allow public read (active only)
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public offers are viewable by everyone" ON public.offers;
CREATE POLICY "Public offers are viewable by everyone"
ON public.offers
FOR SELECT
USING (active = true);

-- 4. Reviews: Allow public read
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone"
ON public.reviews
FOR SELECT
USING (true);
