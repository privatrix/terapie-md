
-- Check policies for therapist_profiles
SELECT * FROM pg_policies WHERE tablename = 'therapist_profiles';

-- Check policies for business_profiles
SELECT * FROM pg_policies WHERE tablename = 'business_profiles';

-- Check if public can read therapist_profiles
-- (We can't easily simulate a request here without more complex setup, but we can check the policy definitions)
