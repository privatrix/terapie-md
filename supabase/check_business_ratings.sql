
-- Check reviews for businesses (where business_id is not null)
SELECT * FROM public.reviews WHERE business_id IS NOT NULL;

-- Check business profiles
SELECT id, company_name, rating, review_count FROM public.business_profiles;

-- Check for mismatch
SELECT 
    bp.company_name,
    bp.review_count as profile_count,
    (SELECT COUNT(*) FROM public.reviews r WHERE r.business_id = bp.id) as actual_count
FROM public.business_profiles bp;
