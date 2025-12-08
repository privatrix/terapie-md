import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { bookingId, therapistId, businessId, rating, comment } = await request.json();

        if (!rating) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!therapistId && !businessId) {
            return NextResponse.json({ error: "Missing provider information" }, { status: 400 });
        }

        let targetBookingId = bookingId;

        // If bookingId is not provided, try to find a completed booking for this user and provider
        if (!targetBookingId) {
            let query = supabase
                .from("bookings")
                .select("id, status")
                .eq("client_id", user.id)
                .eq("status", "completed")
                .order("date", { ascending: false }) // Get the most recent one
                .limit(1);

            if (therapistId) {
                query = query.eq("therapist_id", therapistId);
            } else if (businessId) {
                query = query.eq("business_id", businessId);
            }

            const { data: bookings, error: findError } = await query;

            if (findError || !bookings || bookings.length === 0) {
                return NextResponse.json({ error: "No completed booking found for this provider" }, { status: 404 });
            }

            targetBookingId = bookings[0].id;
        } else {
            // Verify that the booking exists, belongs to the user, matches provider, and is completed
            let query = supabase
                .from("bookings")
                .select("id, status, therapist_id, business_id")
                .eq("id", targetBookingId)
                .eq("client_id", user.id)
                .single();

            const { data: booking, error: bookingError } = await query;

            if (bookingError || !booking) {
                return NextResponse.json({ error: "Booking not found or access denied" }, { status: 404 });
            }

            // Verify provider match if provided
            if (therapistId && booking.therapist_id !== therapistId) {
                return NextResponse.json({ error: "Booking does not match therapist" }, { status: 400 });
            }
            if (businessId && booking.business_id !== businessId) {
                return NextResponse.json({ error: "Booking does not match business" }, { status: 400 });
            }

            if (booking.status !== "completed") {
                return NextResponse.json({ error: "Booking must be completed to leave a review" }, { status: 400 });
            }
        }

        // Insert the review
        const { error: insertError } = await supabase
            .from("reviews")
            .insert({
                therapist_id: therapistId || null,
                business_id: businessId || null,
                client_id: user.id,
                rating,
                comment
            });

        if (insertError) {
            if (insertError.code === "23505") { // Unique violation
                return NextResponse.json({ error: "You have already reviewed this provider" }, { status: 400 });
            }
            throw insertError;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
