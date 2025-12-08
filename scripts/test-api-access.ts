
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

// Use ANON key to simulate public access (subject to RLS)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    const therapistId = 'ce3394c9-424e-45b7-9a30-67a0a8736256'; // Alexandru Fedco
    console.log(`Attempting to fetch therapist ${therapistId} using ANON key...`);

    const { data, error } = await supabase
        .from('therapist_profiles')
        .select('id, name, weekly_schedule')
        .eq('id', therapistId)
        .single();

    if (error) {
        console.error('Error (RLS likely blocking):', error);
    } else {
        console.log('Success! Profile found:', data);
    }
}

main();
