import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, role, name, redirect } = body;

        if (!email || !password || !role || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create Supabase Admin client to generate link
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Generate signup link (creates user if not exists)
        // Ensure redirect URL is absolute
        let redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin")}/auth/callback`;
        if (redirect) {
            redirectTo += `?next=${encodeURIComponent(redirect)}`;
        }

        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: "signup",
            email,
            password,
            options: {
                data: { role, name },
                redirectTo
            }
        });

        if (error) throw error;

        if (!data.properties?.action_link) {
            throw new Error("Failed to generate confirmation link");
        }

        // Update public.users with name (if user was created)
        if (data.user) {
            await supabaseAdmin
                .from('users')
                .update({ name })
                .eq('id', data.user.id);
        }

        // Send confirmation email via Resend
        try {
            await sendConfirmationEmail(
                email,
                name,
                data.properties.action_link
            );
        } catch (emailError: any) {
            console.error("Email sending failed:", emailError);
            // If in Resend test mode (restricted recipient), return the link to the frontend
            if (emailError.message?.includes("only send testing emails") ||
                emailError.message?.includes("resend.com/domains")) {
                return NextResponse.json({
                    success: true,
                    warning: "EMAIL_RESTRICTED",
                    confirmationLink: data.properties.action_link
                });
            }
            throw emailError; // Re-throw other errors
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Signup error details:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
