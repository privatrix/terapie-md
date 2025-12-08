import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const therapistId = searchParams.get("therapistId");
        const offerId = searchParams.get("offerId");
        const date = searchParams.get("date");

        if ((!therapistId && !offerId) || !date) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const supabase = await createClient();
        let baseSlots: string[] = [];
        let profile: any = null;

        // Determine day of week (monday, tuesday, etc.)
        const requestDate = new Date(date);
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[requestDate.getUTCDay()];

        let targetTherapistId = therapistId;
        let targetBusinessId = null;

        if (offerId) {
            // 1a. Fetch Offer Availability
            const { data: offer, error: offerError } = await supabase
                .from("offers")
                .select("availability, provider_id, business_id")
                .eq("id", offerId)
                .single();

            if (offerError || !offer) {
                console.error("Offer fetch error:", offerError);
                return NextResponse.json({ error: "Offer not found" }, { status: 404 });
            }

            // Set targets from offer
            targetTherapistId = offer.provider_id;
            targetBusinessId = offer.business_id;

            if (offer.availability && offer.availability[dayName]) {
                baseSlots = offer.availability[dayName] || [];
            }
        } else if (therapistId) {
            // 1b. Fetch Therapist Availability
            const { data: therapistProfile, error: profileError } = await supabase
                .from("therapist_profiles")
                .select("weekly_schedule, available_slots")
                .eq("id", therapistId)
                .single();

            if (profileError || !therapistProfile) {
                return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
            }
            profile = therapistProfile;

            if (profile.weekly_schedule && profile.weekly_schedule[dayName]) {
                const daySchedule = profile.weekly_schedule[dayName];
                if (daySchedule.active) {
                    baseSlots = daySchedule.slots || [];
                }
            } else {
                baseSlots = profile.available_slots || [];
            }
        }

        if (baseSlots.length === 0) {
            return NextResponse.json({ slots: [] });
        }

        // 2. Fetch existing bookings for this date
        let bookingsQuery = supabase
            .from("bookings")
            .select("time")
            .eq("date", date)
            .neq("status", "cancelled");

        if (targetTherapistId) {
            bookingsQuery = bookingsQuery.eq("therapist_id", targetTherapistId);
        } else if (targetBusinessId) {
            bookingsQuery = bookingsQuery.eq("business_id", targetBusinessId);
        }

        const { data: bookings, error: bookingsError } = await bookingsQuery;

        if (bookingsError) {
            console.error("Bookings fetch error:", bookingsError);
            throw bookingsError;
        }

        const bookedTimes = bookings?.map(b => b.time.slice(0, 5)) || []; // Ensure format HH:MM

        // 3. Filter out booked slots
        // Normalize time formats to ensure matching works (e.g. "09:00:00" vs "09:00")
        const availableSlots = baseSlots.filter((slot: string) => {
            const normalizedSlot = slot.slice(0, 5);
            return !bookedTimes.some(booked => booked === normalizedSlot);
        });

        return NextResponse.json({
            slots: availableSlots
        });

    } catch (error: any) {
        console.error("Error fetching availability:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
