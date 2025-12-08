-- Add name column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;

-- Update existing users with name from metadata if available (optional, but good for consistency)
-- This requires a function or manual update, but for now we just add the column.
