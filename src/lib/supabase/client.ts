import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookieOptions: {
                // Ensure cookies work on http://localhost
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            }
        }
    )
}
