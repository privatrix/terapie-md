-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_profiles ENABLE ROW LEVEL SECURITY;

-- BOOKINGS POLICIES --

-- 1. Client View
DROP POLICY IF EXISTS "Clients can view own bookings" ON bookings;
CREATE POLICY "Clients can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = client_id);

-- 2. Therapist View (The critical one)
DROP POLICY IF EXISTS "Therapists can view assigned bookings" ON bookings;
CREATE POLICY "Therapists can view assigned bookings"
ON bookings FOR SELECT
USING (
  -- Check if the booking's therapist_id matches a profile owned by the user
  bookings.therapist_id IN (
    SELECT id FROM therapist_profiles WHERE user_id = auth.uid()
  )
);

-- THERAPIST PROFILES POLICIES --

-- 1. Public View (if not already exists)
-- Usually profiles are public, but let's ensure owners can see them
DROP POLICY IF EXISTS "Therapists can update own profile" ON therapist_profiles;
CREATE POLICY "Therapists can update own profile"
ON therapist_profiles FOR ALL
USING (user_id = auth.uid());

-- 2. Public Read
DROP POLICY IF EXISTS "Public can view therapist profiles" ON therapist_profiles;
CREATE POLICY "Public can view therapist profiles"
ON therapist_profiles FOR SELECT
USING (true);

