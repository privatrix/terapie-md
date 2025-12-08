# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (or create account)
4. Click "New Project"
5. Fill in:
   - **Name**: `terapie-md`
   - **Database Password**: (generate strong password and save it)
   - **Region**: Choose closest to you (Europe Central recommended for Moldova)
6. Click "Create new project" (takes ~2 minutes)

## 2. Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJh...` (long string)
   - **service_role key**: `eyJh...` (even longer string)

## 3. Configure Environment Variables

Create a file `.env.local` in the root of your project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**: Replace the placeholders with your actual values!

## 4. Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the entire content of `supabase/schema.sql`
4. Paste it into the query editor
5. Click **Run** (bottom right)
6. You should see "Success. No rows returned" - this is good!

## 5. Verify Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - users
   - therapist_profiles
   - offers  
   - bookings
   - reviews
   - contact_submissions

## 6. Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. "Email" should already be enabled
3. For production, configure **Email Templates** (optional for now)

## 7. Seed Sample Data (Optional)

To test with some sample therapists, run this in SQL Editor:

\`\`\`sql
-- This will be populated when therapists sign up
-- For now, the app will work with empty tables
\`\`\`

## 8. Test the Connection

1. Restart your Next.js dev server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Check the console for any Supabase-related errors

## Next Steps

Once this setup is complete, we can:
- ✅ Create authentication pages (sign up, login)
- ✅ Convert pages to use real database data
- ✅ Implement booking functionality
- ✅ Add file uploads for therapist photos

## Troubleshooting

**Error: "Invalid API key"**
- Double-check your `.env.local` file
- Make sure you restarted the dev server
- Verify you copied the correct keys from Supabase dashboard

**Error: "relation does not exist"**
- Make sure you ran the `schema.sql` file completely
- Check in Table Editor that tables were created

**RLS Policy errors**
- This is normal before authentication is set up
- We'll fix this when we add auth pages

## Security Notes

- ❌ **Never** commit `.env.local` to Git (it's already in `.gitignore`)
- ✅ The `anon` key is safe for client-side code
- ❌ Never expose the `service_role` key in client code
