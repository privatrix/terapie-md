
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing URL or Service Role Key');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function restoreUser(email: string) {
    console.log(`Restoring/Checking user: ${email}`);

    // Try to create the user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: 'TempPassword123!',
        email_confirm: true // Auto confirm
    });

    if (error) {
        console.log("Create User Error:", error.message);
        if (error.message.includes("already registered") || error.status === 422 || error.message.includes("exists")) {
            console.log("USER ALREADY EXISTS. Sending password reset...");
            const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
                redirectTo: 'http://localhost:3000/auth/reset-password' // Assuming localhost or production URL
            });
            if (resetError) {
                console.log("Reset Password Error:", resetError.message);
            } else {
                console.log("Password reset email sent.");
            }
        }
    } else {
        console.log("User CREATED successfully with temp password: TempPassword123!");
        console.log("User ID:", data.user.id);

        // Also create entry in public users table if missing
        const { error: publicError } = await supabaseAdmin
            .from('users')
            .upsert({
                id: data.user.id,
                email: email,
                role: 'therapist' // Assuming therapist application
            });

        if (publicError) console.log("Public table update error:", publicError.message);
        else console.log("Public table synced.");
    }
}

restoreUser('alexandrufedco@icloud.com').then(() => console.log('Done')).catch(console.error);
