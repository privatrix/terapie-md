import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const updates = [
    { email: 'alexfedco4@gmail.com', password: 'Terapie#Secure!2025_Alpha' },
    { email: 'alexandrufedco@icloud.com', password: 'Terapie#Secure!2025_Beta' },
    { email: 'alexanderfedco@gmail.com', password: 'Terapie#Secure!2025_Gamma' },
    { email: 'alexfedco2@gmail.com', password: 'Terapie#Secure!2025_Delta' }
];

async function rotate() {
    console.log("Starting secure password rotation...");
    for (const u of updates) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const user = users.find(x => x.email === u.email);

        if (user) {
            const { error } = await supabase.auth.admin.updateUserById(
                user.id,
                { password: u.password }
            );
            if (error) {
                console.error(`Failed to update ${u.email}:`, error.message);
            } else {
                console.log(`✅ Updated password for ${u.email}`);
            }
        } else {
            console.warn(`⚠️ User ${u.email} not found in Supabase Auth.`);
        }
    }
    console.log("Rotation complete.");
}

rotate();
