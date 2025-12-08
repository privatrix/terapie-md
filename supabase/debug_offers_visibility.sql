
-- Check total offers
SELECT count(*) as total_offers FROM public.offers;

-- Check active offers
SELECT count(*) as active_offers FROM public.offers WHERE active = true;

-- Check RLS status on offers table
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE oid = 'public.offers'::regclass;

-- List policies on offers table
SELECT * FROM pg_policies WHERE tablename = 'offers';

-- Check if any offers are returned for a simulated anonymous user (if possible, or just general check)
SELECT id, title, provider_id, business_id FROM public.offers LIMIT 5;
