
-- Add availability column to offers table
ALTER TABLE public.offers 
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{}'::jsonb;

-- Example structure:
-- {
--   "monday": ["09:00", "10:00", "11:00"],
--   "tuesday": [],
--   "wednesday": ["14:00", "15:00"]
-- }
