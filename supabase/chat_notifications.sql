-- Add read_at column to booking_messages
ALTER TABLE public.booking_messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- Add notification_preferences to users if not exists
-- It seems ClientSettings.tsx assumes it exists, but let's make sure it's in the schema properly
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'notification_preferences') THEN
        ALTER TABLE public.users ADD COLUMN notification_preferences JSONB DEFAULT '{"email_booking": true, "email_marketing": false}';
    END IF;
END $$;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_read(p_booking_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.booking_messages
  SET read_at = TIMEZONE('utc', NOW())
  WHERE booking_id = p_booking_id
  AND sender_id != p_user_id
  AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
