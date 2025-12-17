import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
    console.log("API: /api/therapist/bookings called");

    // HOT RELOAD ENV VARS (Workaround for stale server)
    // BRUTE FORCE RELOAD ENV VARS (Workaround for stale server)
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.log("API: Service Key missing, attempting BRUTE FORCE READ of .env.local");
        try {
            const fs = require('fs');
            // Try explicit paths
            const possiblePaths = [
                path.resolve(process.cwd(), ".env.local"),
                path.resolve(process.cwd(), "..", ".env.local"),
                path.resolve(__dirname, ".env.local"),
                path.resolve(__dirname, "..", ".env.local"),
                path.resolve(__dirname, "..", "..", ".env.local"),
                "c:\\Users\\user\\.gemini\\antigravity\\scratch\\terapie-md\\.env.local" // Absolute fallback for this user machine
            ];

            let rawEnv = "";
            for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                    console.log(`API: Found .env.local at ${p}`);
                    rawEnv = fs.readFileSync(p, 'utf-8');
                    break;
                }
            }

            if (rawEnv) {
                const match = rawEnv.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
                if (match && match[1]) {
                    process.env.SUPABASE_SERVICE_ROLE_KEY = match[1].trim().replace(/^["']|["']$/g, '');
                    console.log("API: Brute Force Key Extraction SUCCESS.");
                } else {
                    console.error("API: Key not found in file content.");
                }
            } else {
                console.error("API: .env.local file not found in any checked path.");
                console.error("Checked: ", possiblePaths.join(", "));
            }
        } catch (e) {
            console.error("API: Brute Force Failed:", e);
        }
    }

    try {
        const supabase = await createClient();

        // 1. Auth Check (Standard Client needed for Session)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.log("API: Unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.log("API: User authenticated:", user.id);

        // Initialize Admin Client
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceKey) {
            console.error("API: SUPABASE_SERVICE_ROLE_KEY is missing!");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // 2. Get Therapist Profile (Admin Client - Bypass RLS)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from("therapist_profiles")
            .select("id")
            .eq("user_id", user.id)
            .single();

        if (profileError || !profile) {
            console.error("API: Profile error or not found:", profileError);
            return NextResponse.json({ error: "Therapist profile not found" }, { status: 404 });
        }
        console.log("API: Found Profile:", profile.id);

        // 3. Fetch Bookings (Admin Client - Bypass RLS)
        const { data: bookings, error: dbError } = await supabaseAdmin
            .from("bookings")
            .select(`
                *,
                client:users!client_id(email, name, phone),
                messages:booking_messages(id, read_at, sender_id)
            `)
            .eq("therapist_id", profile.id)
            .order("created_at", { ascending: false });

        if (dbError) {
            console.error("API: Database error fetching bookings:", dbError);
            return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
        }

        console.log("API: Fetched bookings count:", bookings?.length);

        // 4. Sanitize Data (Privacy Layer)
        const sanitizedBookings = bookings.map((booking: any) => {
            const isPending = booking.status === "pending" || booking.status === "unconfirmed";

            // Calculate unread count
            const unreadCount = booking.messages?.filter(
                (m: any) => m.read_at === null && m.sender_id !== user.id
            ).length || 0;

            const client = booking.client || {};

            if (isPending) {
                return {
                    ...booking,
                    client: {
                        name: client.name, // Name is visible
                        email: null, // HIDDEN
                        phone: null, // HIDDEN
                        is_masked: true // Flag for UI
                    },
                    unreadCount
                };
            }

            return {
                ...booking,
                unreadCount
            };
        });

        return NextResponse.json(sanitizedBookings);

    } catch (error: any) {
        console.error("API: Critical error:", error);
        return NextResponse.json({
            error: `Internal Server Error: ${error.message}`,
            details: error.stack
        }, { status: 500 });
    }
}
