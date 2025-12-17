
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createTestBooking() {
    console.log("--- Creating Test Booking ---");

    // Elena's ID (from previous debug)
    const therapistId = "46d9d3a6-0bfb-4427-a8e1-203175515fd7";

    // Use the authorized user ID for Elena as the therapist user ID (just for reference)
    // But we need a CLIENT ID. 
    // I'll grab the first user from auth.users that is NOT the therapist user.

    // Actually, I can just grab a random user ID from 'users' table (since 'users' view wraps auth.users)
    const { data: users } = await supabase.from("users").select("id").limit(2);
    const clientId = users?.[0]?.id;

    if (!clientId) {
        console.error("No users found to act as client.");
        return;
    }

    console.log(`Using Client ID: ${clientId}`);
    console.log(`Target Therapist ID: ${therapistId}`);

    const { data, error } = await supabase
        .from("bookings")
        .insert([
            {
                client_id: clientId,
                therapist_id: therapistId,
                date: new Date().toISOString().split('T')[0], // Today
                time: "10:00",
                status: "pending",
                notes: "Test booking manually injected via script"
            }
        ])
        .select()
        .single();

    if (error) {
        console.error("Error creating booking:", error);
    } else {
        console.log("✅ Booking Created Successfully!");
        console.log("ID:", data.id);
        console.log("Please ask the user to refresh the dashboard immediately.");
    }
}

createTestBooking();
