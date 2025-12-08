import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        // 1. Verify the current user is an admin
        const supabase = await createServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin in the database
        const { data: userRole, error: roleError } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();

        if (roleError || userRole?.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        // 2. Get the user ID to delete from request body
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // 3. Delete the user using Supabase Admin Client
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey!, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        console.log(`Attempting to delete user ${userId}...`);

        // Step A: Delete from public.users FIRST to resolve FK constraints
        // This will cascade to therapist_profiles, bookings, etc.
        const { error: dbError } = await supabaseAdmin
            .from("users")
            .delete()
            .eq("id", userId);

        if (dbError) {
            console.error("Error deleting from public.users:", dbError);
            throw new Error(`Database error: ${dbError.message}`);
        }

        console.log(`Deleted from public.users. Now deleting from auth.users...`);

        // Step B: Delete from auth.users
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            console.error("Error deleting from auth.users:", deleteError);
            throw new Error(`Auth error: ${deleteError.message}`);
        }

        console.log(`Successfully deleted user ${userId}`);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
