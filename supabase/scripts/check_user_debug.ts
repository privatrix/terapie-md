
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser(email: string) {
    console.log(`Checking user: ${email}`);

    // 1. Check Auth (if service key available)
    if (serviceRoleKey) {
        console.log("Service Role Key found. Checking auth.users...");
        const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // listUsers defaults to page 1, 50 users. Should likely find it if it's new.
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) {
            console.error("Auth Admin Error:", error.message);
        } else {
            const authUser = data.users.find(u => u.email === email);
            if (authUser) {
                console.log("FOUND IN AUTH:", {
                    id: authUser.id,
                    email: authUser.email,
                    confirmed_at: authUser.confirmed_at,
                    last_sign_in: authUser.last_sign_in_at
                });
            } else {
                console.log("NOT FOUND IN AUTH USERS (via Admin API).");
            }
        }
    } else {
        console.log("No Service Role Key found. Skipping Auth check.");
    }

    // 2. Check Public Table
    const { data: publicUser, error: publicError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (publicError) {
        console.log('Public table result:', publicError.message);
    } else {
        console.log('Found in public users table:', publicUser);
    }
}

checkUser('alexandrufedco@icloud.com').then(() => console.log('Done')).catch(e => console.error(e));
