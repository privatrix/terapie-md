import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name, type } = body;

        if (!email || !password || !name || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create Supabase client with service role key (admin privileges)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!, // This is the secret key!
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Check if user already exists
        const { data: existingUsers, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users.find(u => u.email === email);

        if (existingUser) {
            // Update password for existing user so the email credentials work
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                existingUser.id,
                { password: password }
            );

            if (updateError) {
                console.error('Error updating password for existing user:', updateError);
                return NextResponse.json({ error: 'Failed to update password for existing user' }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                user: existingUser,
                isExisting: true
            });
        }

        // Create the user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                requires_password_change: true,
                name
            }
        });

        if (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            user: authData.user,
            isExisting: false
        });

    } catch (error: any) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
