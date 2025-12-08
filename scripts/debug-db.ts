
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Fetching therapist profiles...');
    const { data: profiles, error } = await supabase
        .from('therapist_profiles')
        .select('id, name, weekly_schedule');

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log(`Found ${profiles.length} profiles.`);

    const therapistId = 'ce3394c9-424e-45b7-9a30-67a0a8736256'; // Alexandru Fedco
    const date = '2025-12-05';

    console.log(`Checking bookings for therapist ${therapistId} on ${date}...`);

    const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('therapist_id', therapistId)
        .eq('date', date);

    if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
    } else {
        console.log(`Found ${bookings.length} bookings for ${date}:`);
        bookings.forEach(b => {
            console.log(`- ID: ${b.id}, Time: ${b.time}, Status: ${b.status}, Date: ${b.date}`);
        });
    }

    profiles.forEach(p => {
        console.log('------------------------------------------------');
        console.log(`Therapist: ${p.name} (${p.id})`);
        console.log('Weekly Schedule:', JSON.stringify(p.weekly_schedule, null, 2));
    });
}

main();
