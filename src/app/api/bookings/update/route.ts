import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendBookingStatusEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { bookingId, status, reason } = body;

        // 1. Fetch booking with related data
        const { data: booking, error: fetchError } = await supabase
            .from("bookings")
            .select(`
                *,
                therapist_profiles(id, user_id, name),
                business_profiles(id, user_id, company_name)
            `)
            .eq("id", bookingId)
            .single();

        if (fetchError || !booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // 2. Determine who is updating
        const isClient = booking.client_id === session.user.id;
        const isTherapist = booking.therapist_profiles?.user_id === session.user.id;
        const isBusiness = booking.business_profiles?.user_id === session.user.id;

        if (!isClient && !isTherapist && !isBusiness) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // 3. Initialize Admin Client (Bypass RLS for update)
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey!, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 4. Update booking status using Admin Client
        const providerName = isClient ? 'Client' : (isTherapist ? 'Terapeut' : 'Business');
        const { error: updateError } = await supabaseAdmin
            .from("bookings")
            .update({ status, notes: reason ? `${booking.notes || ''}\n\n[${providerName}]: ${reason}` : booking.notes })
            .eq("id", bookingId);

        if (updateError) throw updateError;

        // 5. Send notifications (Non-blocking)
        try {
            const providerUserId = booking.therapist_profiles?.user_id || booking.business_profiles?.user_id;
            const providerDisplayName = booking.therapist_profiles?.name || booking.business_profiles?.company_name || "Furnizor";

            if (isClient && status === 'cancelled') {
                // Client cancelled -> Notify Provider (Therapist or Business)
                if (providerUserId) {
                    const { data: providerUser } = await supabaseAdmin.auth.admin.getUserById(providerUserId);

                    if (providerUser?.user?.email) {
                        const { sendBookingCancellationEmail } = await import("@/lib/email");
                        await sendBookingCancellationEmail({
                            therapistEmail: providerUser.user.email,
                            therapistName: providerDisplayName,
                            clientName: session.user.user_metadata?.name || "Client",
                            date: booking.date,
                            time: booking.time,
                            reason
                        });
                    }
                }
            } else if (isTherapist || isBusiness) {
                // Provider updated -> Notify Client
                const { data: clientUser } = await supabaseAdmin.auth.admin.getUserById(booking.client_id);

                if (clientUser?.user?.email) {
                    const { sendBookingStatusEmail } = await import("@/lib/email");
                    await sendBookingStatusEmail({
                        clientEmail: clientUser.user.email,
                        clientName: clientUser.user.user_metadata?.name || "Client",
                        therapistName: providerDisplayName,
                        therapistId: booking.therapist_id || booking.business_id, // Use generic ID
                        date: booking.date,
                        time: booking.time,
                        status,
                        reason
                    });
                }
            }
        } catch (emailError) {
            console.error("Error sending email notification:", emailError);
            // Don't fail the request if email fails, but log it
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error updating booking:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
