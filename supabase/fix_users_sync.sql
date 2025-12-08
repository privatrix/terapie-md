
-- 1. Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'client');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill existing users (Run this once to fix missing records)
INSERT INTO public.users (id, email, role)
SELECT id, email, 'client'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);

-- 4. Now you can safely update your admin role
-- Replace with your actual email
-- UPDATE public.users SET role = 'admin' WHERE email = 'your_email@example.com';
