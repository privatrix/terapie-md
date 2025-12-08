-- Diagnostic Script to check Booking Messages status
-- Run this in the Supabase SQL Editor

BEGIN;

-- 1. Check if table exists and has data (as admin)
DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count FROM public.booking_messages;
  RAISE NOTICE 'Total messages in DB: %', v_count;
END $$;

-- 2. List active policies on booking_messages
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'booking_messages';

-- 3. Check if the 'can_access_booking' function exists
SELECT routine_name, security_type 
FROM information_schema.routines 
WHERE routine_name = 'can_access_booking';

-- 4. Sample check: Select top 5 messages and their booking IDs
SELECT id, booking_id, sender_id, substring(content from 1 for 20) as preview 
FROM public.booking_messages 
LIMIT 5;

ROLLBACK; -- Don't make changes, just check
