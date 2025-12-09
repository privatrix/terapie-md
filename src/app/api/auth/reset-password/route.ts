import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Create Supabase client with service role key
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Generate password reset link
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: email,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback?next=/auth/update-password`
            }
        });

        if (error) {
            console.error('Generate link error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data.properties?.action_link) {
            return NextResponse.json({ error: 'Failed to generate reset link' }, { status: 500 });
        }

        // Send custom email
        await sendPasswordResetEmail(email, data.properties.action_link);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
