-- Add photo_url column to therapist_profiles
ALTER TABLE therapist_profiles
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_therapist_profiles_photo_url 
ON therapist_profiles(photo_url);
