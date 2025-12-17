-- Enable RLS on bookings if not already enabled
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 1. Policy for Clients: View their own bookings
DROP POLICY IF EXISTS "Clients can view own bookings" ON bookings;
CREATE POLICY "Clients can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = client_id);

-- 2. Policy for Therapists: View bookings assigned to them
DROP POLICY IF EXISTS "Therapists can view assigned bookings" ON bookings;
CREATE POLICY "Therapists can view assigned bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM therapist_profiles tp
    WHERE tp.id = bookings.therapist_id
    AND tp.user_id = auth.uid()
  )
);

-- 3. Policy for Businesses: View bookings assigned to them
DROP POLICY IF EXISTS "Businesses can view assigned bookings" ON bookings;
CREATE POLICY "Businesses can view assigned bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM business_profiles bp
    WHERE bp.id = bookings.business_id
    AND bp.user_id = auth.uid()
  )
);
