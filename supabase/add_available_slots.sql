-- Add available_slots column to therapist_profiles
ALTER TABLE public.therapist_profiles
ADD COLUMN IF NOT EXISTS available_slots TEXT[] DEFAULT '{"09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"}';

-- Add email column to bookings for guests (optional, but good for future)
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- Add phone column to bookings for guests (optional)
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS guest_phone TEXT;
