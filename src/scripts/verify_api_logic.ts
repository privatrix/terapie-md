
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verifyApiLogic() {
    console.log("--- Verifying API Logic ---");

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
        console.error("❌ SUPABASE_SERVICE_ROLE_KEY missing in .env.local");
        return;
    }

    if (serviceKey === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("❌ SERVICE_KEY is identical to ANON_KEY! This is the problem.");
        return;
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    const profileId = "46d9d3a6-0bfb-4427-a8e1-203175515fd7"; // Elena

    console.log(`Querying bookings for Therapist ID: ${profileId}`);

    const { data: bookings, error } = await supabaseAdmin
        .from("bookings")
        .select(`
        *,
        client:users!client_id(email, name, phone),
        messages:booking_messages(id, read_at, sender_id)
    `)
        .eq("therapist_id", profileId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("❌ DB Error:", error);
    } else {
        console.log(`✅ Success. Found ${bookings.length} bookings.`);
        if (bookings.length > 0) {
            console.log("First booking ID:", bookings[0].id);
            console.log("First booking Status:", bookings[0].status);
        } else {
            console.log("⚠️ No bookings found. Check if they exist in DB at all?");
        }
    }

    // Double check basic existence without joins (to rule out join failure)
    const { count, error: countError } = await supabaseAdmin
        .from("bookings")
        .select("*", { count: 'exact', head: true })
        .eq("therapist_id", profileId);

    console.log(`Raw Count (no joins): ${count} (Error: ${countError?.message})`);
}

verifyApiLogic();
