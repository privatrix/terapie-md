
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
    const email = 'alex@terapie.md';

    console.log("Checking application for:", email);
    const { data: apps, error: appError } = await supabase
        .from("therapist_applications")
        .select("id, email, specialties, specializations")
        .eq("email", email);

    if (appError) {
        console.error("App Error:", appError);
    } else {
        console.log("Applications:", JSON.stringify(apps, null, 2));
    }

    console.log("\nChecking profile for:", email);
    // Get user id first
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    const user = users?.find(u => u.email === email);

    if (user) {
        console.log("User ID:", user.id);
        const { data: profile, error: profileError } = await supabase
            .from("therapist_profiles")
            .select("specialties, specializations")
            .eq("user_id", user.id);

        if (profileError) {
            console.error("Profile Error:", profileError);
        } else {
            console.log("Profile:", JSON.stringify(profile, null, 2));
        }
    } else {
        console.log("User not found in auth");
    }
}

checkData();
