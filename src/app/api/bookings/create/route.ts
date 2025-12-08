import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendBookingRequestEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { therapistId, businessId, offerId, date, time, notes } = body;

        // 1. Create booking in database
        const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .insert([
                {
                    client_id: session.user.id,
                    therapist_id: therapistId || null,
                    business_id: businessId || null,
                    offer_id: offerId || null,
                    date,
                    time,
                    notes,
                    status: "pending"
                }
            ])
            .select()
            .single();

        if (bookingError) throw bookingError;

        // 2. Fetch provider details for email
        let providerName = "Provider";
        let providerUserId = null;

        if (therapistId) {
            const { data: therapist } = await supabase
                .from("therapist_profiles")
                .select("name, user_id")
                .eq("id", therapistId)
                .single();
            if (therapist) {
                providerName = therapist.name;
                providerUserId = therapist.user_id;
            }
        } else if (businessId) {
            const { data: business } = await supabase
                .from("business_profiles")
                .select("company_name, user_id")
                .eq("id", businessId)
                .single();
            if (business) {
                providerName = business.company_name;
                providerUserId = business.user_id;
            }
        }

        // 3. Fetch provider email using admin client
        if (providerUserId) {
            const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey!, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            });

            const { data: providerUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(providerUserId);

            if (!userError && providerUser?.user?.email) {
                await sendBookingRequestEmail({
                    therapistEmail: providerUser.user.email, // reusing prop name for simplicity
                    therapistName: providerName,
                    clientName: session.user.email || "Client",
                    date,
                    time,
                    notes
                });
            }
        }

        return NextResponse.json({ success: true, booking });

    } catch (error: any) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
