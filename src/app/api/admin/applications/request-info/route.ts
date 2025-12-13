import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendDocumentRequestEmail, sendReplyEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { applicationId, name, email, message, documents } = await request.json();

        // 1. Verify Admin (simplified for now, relying on Middleware or RLS usually, but here we just check if it works)
        // ideally we check session here.

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 2. Send Email
        if (documents && documents.length > 0) {
            await sendDocumentRequestEmail({
                name,
                email,
                documentsList: documents
            });
        } else {
            // Generic message
            await sendReplyEmail({
                name,
                email,
                subject: "Information Request regarding your application",
                message
            });
        }

        // 3. Update Status (Optional)
        // await supabase.from('therapist_applications').update({ status: 'info_requested' }).eq('id', applicationId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Request info error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
