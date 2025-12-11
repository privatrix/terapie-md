
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

async function forcePassword(email: string, newPassword: string) {
    console.log(`Force resetting password for: ${email}`);

    // 1. Get User ID
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
        console.error("List users error:", error);
        return;
    }

    const user = data.users.find(u => u.email === email);

    if (!user) {
        console.error("User not found in Auth system.");
        return;
    }

    console.log(`Found user ${user.id}. Updating password...`);

    // 2. Update Password
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: newPassword, email_confirm: true }
    );

    if (updateError) {
        console.error("Update error:", updateError.message);
    } else {
        console.log("SUCCESS: Password updated manually.");
        console.log(`New password is: ${newPassword}`);
    }
}

forcePassword('alexandrufedco@icloud.com', 'Terapie2025!');
