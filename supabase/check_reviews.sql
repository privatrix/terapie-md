
-- Check reviews
SELECT * FROM public.reviews;

-- Check therapist profiles
SELECT id, name, rating, review_count FROM public.therapist_profiles;

-- Check if there is a mismatch
SELECT 
    tp.name,
    tp.review_count as profile_count,
    (SELECT COUNT(*) FROM public.reviews r WHERE r.therapist_id = tp.id) as actual_count
FROM public.therapist_profiles tp;
