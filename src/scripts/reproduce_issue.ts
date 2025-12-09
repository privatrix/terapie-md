import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function reproduce() {
    console.log("1. Finding Therapist ID...");
    const { data: therapists } = await supabase
        .from('therapist_profiles')
        .select('id, name')
        .ilike('name', '%Alexandru Fedco%');

    if (!therapists || therapists.length === 0) {
        console.error("Therapist not found");
        return;
    }
    const id = therapists[0].id;
    console.log(`Target ID: ${id}`);

    console.log("2. Testing Date logic locally...");
    const dateStr = '2025-12-15';

    console.log("3. Fetching from API...");
    const url = `http://localhost:3000/api/bookings/availability?therapistId=${id}&date=${dateStr}`;
    console.log(`GET ${url}`);

    try {
        const res = await fetch(url);
        const json = await res.json();
        console.log("STATUS:", res.status);
        console.log("ENV CHECK:", JSON.stringify(json.env_check, null, 2));
        console.log("DEBUG ERROR:", JSON.stringify(json.debug_error, null, 2));
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

reproduce();
