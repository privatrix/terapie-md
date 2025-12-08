import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNewMessageEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { bookingId, content } = body;

        if (!bookingId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Insert message
        const { data: message, error: insertError } = await supabase
            .from("booking_messages")
            .insert({
                booking_id: bookingId,
                sender_id: user.id,
                content: content.trim()
            })
            .select()
            .single();

        if (insertError) throw insertError;

        // 2. Fetch booking details to identify recipient
        const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .select(`
                *,
                client:users!client_id(id, email, name, notification_preferences),
                therapist:therapist_profiles!therapist_id(
                    id, 
                    user_id, 
                    name, 
                    user:users!user_id(email, notification_preferences)
                )
            `)
            .eq("id", bookingId)
            .single();

        if (bookingError) {
            console.error("Error fetching booking details:", bookingError);
            return NextResponse.json({ success: true, message }); // Return success even if email fails
        }

        // Determine recipient
        let recipientEmail: string | null = null;
        let recipientName: string = "Utilizator";
        let senderName: string = "Utilizator";
        let shouldSendEmail = false;

        const isClientSender = user.id === booking.client_id;

        if (isClientSender) {
            // Sender is client, recipient is therapist
            recipientEmail = booking.therapist?.user?.email;
            recipientName = booking.therapist?.name;
            senderName = booking.client?.name || "Client";

            // Check therapist preferences (default to true if missing)
            const prefs = booking.therapist?.user?.notification_preferences;
            shouldSendEmail = !prefs || prefs.email_booking !== false;
        } else {
            // Sender is therapist, recipient is client
            recipientEmail = booking.client?.email;
            recipientName = booking.client?.name || "Client";
            senderName = booking.therapist?.name;

            // Check client preferences
            const prefs = booking.client?.notification_preferences;
            shouldSendEmail = !prefs || prefs.email_booking !== false;
        }

        // 3. Send email if applicable
        if (shouldSendEmail && recipientEmail) {
            try {
                await sendNewMessageEmail({
                    toEmail: recipientEmail,
                    recipientName,
                    senderName,
                    messagePreview: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
                    bookingLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` // Simplified link
                });
            } catch (emailError) {
                console.error("Error sending email notification:", emailError);
                // Don't fail the request if email fails
            }
        }

        return NextResponse.json({ success: true, message });

    } catch (error: any) {
        console.error('Message sending error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
