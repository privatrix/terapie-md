
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use service role to see all data

if (!supabaseKey) {
    console.error("Error: SUPABASE_SERVICE_ROLE_KEY is required in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugBookings() {
    console.log("--- Debugging Bookings ---");

    // 1. Fetch all therapist profiles first for lookup
    const { data: profiles, error: profilesError } = await supabase
        .from("therapist_profiles")
        .select("id, name, user_id");

    if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return;
    }

    const profileMap = new Map(profiles.map(p => [p.id, p.name]));

    // 2. Fetch recent bookings
    const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

    if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
    } else {
        console.log(`Found ${bookings?.length || 0} recent bookings:`);
        bookings?.forEach((b) => {
            const therapistName = profileMap.get(b.therapist_id) || "UNKNOWN";
            console.log(`- Booking ID: ${b.id}`);
            console.log(`  Created At: ${b.created_at}`);
            console.log(`  Therapist: ${therapistName} (ID: ${b.therapist_id})`);
            console.log(`  Client ID: ${b.client_id}`);
            console.log(`  Status: ${b.status}`);
            console.log("-----------------------------------");
        });
    }
}

debugBookings();
