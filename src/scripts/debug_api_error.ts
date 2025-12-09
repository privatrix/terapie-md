import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    const { data: therapists } = await supabase
        .from('therapist_profiles')
        .select('id')
        .ilike('name', '%Alexandru Fedco%');

    if (!therapists || therapists.length === 0) return;
    const id = therapists[0].id;

    const url = `http://localhost:3000/api/bookings/availability?therapistId=${id}&date=2025-12-15`;
    console.log(`Fetching ${url}...`);

    try {
        const res = await fetch(url);
        const json = await res.json();
        console.log(`Status: ${res.status}`);
        fs.writeFileSync('last_api_error.json', JSON.stringify(json, null, 2));
        console.log("Response saved to last_api_error.json");
    } catch (e) {
        console.error(e);
    }
}

debug();
