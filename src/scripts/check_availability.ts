import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTherapist() {
    console.log("Searching for Alexandru Fedco...");

    const { data, error } = await supabase
        .from('therapist_profiles')
        .select('*');

    if (error) {
        console.error("Query Error:", error);
        return;
    }

    if (!data) return;

    const therapist = data.find(t => t.name.includes("Alexandru") || t.name.includes("Fedco"));

    if (!therapist) {
        console.log("Alexandru Fedco NOT found.");
        return;
    }

    console.log(`Found: ${therapist.name}`);
    console.log(`Verified: ${therapist.verified}`);

    const schedule = therapist.weekly_schedule || {};
    console.log("Schedule Keys:", Object.keys(schedule));
    console.log("Monday Entry:", JSON.stringify(schedule['monday'] || "Missing", null, 2));
    console.log("Monday (Lower) Check:", schedule['monday'] ? "EXISTS" : "MISSING");
    console.log("Monday (Title) Check:", schedule['Monday'] ? "EXISTS" : "MISSING");
    console.log("Luni Check:", schedule['Luni'] ? "EXISTS" : "MISSING");
}

checkTherapist();
