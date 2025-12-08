
SELECT 
    bp.id, 
    bp.company_name, 
    bp.rating, 
    bp.review_count,
    (SELECT COUNT(*) FROM public.reviews r WHERE r.business_id = bp.id) as actual_reviews
FROM public.business_profiles bp
WHERE bp.company_name ILIKE '%Lotus Spa%';
