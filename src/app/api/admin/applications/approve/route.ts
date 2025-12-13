import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendApprovalEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { applicationId } = await request.json();

        if (!applicationId) {
            return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Fetch Application
        const { data: app, error: appError } = await supabaseAdmin
            .from("therapist_applications")
            .select("*")
            .eq("id", applicationId)
            .single();

        if (appError || !app) {
            throw new Error("Application not found");
        }

        let userId = app.user_id;
        let generatedPassword: string | undefined;

        // 2a. Create User if not exists
        if (!userId) {
            generatedPassword = Math.random().toString(36).slice(-8) + "Aa1!"; // Simple random password

            const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: app.email,
                password: generatedPassword,
                email_confirm: true,
                user_metadata: { name: app.name, role: 'therapist', requires_password_change: true }
            });

            if (createError) {
                console.log("User creation failed, checking if user exists in Auth:", createError.message);

                // Try to find the user in the Auth system directly to get their ID
                const { data: { users: authUsers }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
                const existingAuthUser = authUsers?.find(u => u.email?.toLowerCase() === app.email.toLowerCase());

                if (existingAuthUser) {
                    console.log("Found existing user in Auth system:", existingAuthUser.id);
                    userId = existingAuthUser.id;

                    // Reset password and set flag
                    generatedPassword = Math.random().toString(36).slice(-8) + "Aa1!";
                    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                        userId,
                        {
                            password: generatedPassword,
                            user_metadata: { ...existingAuthUser.user_metadata, requires_password_change: true }
                        }
                    );

                    if (updateError) {
                        console.error("Failed to reset password for existing user:", updateError);
                        // If we can't reset pass, maybe don't send one? Or throw?
                        // Let's fallback to not sending it if update fails, but log it.
                        generatedPassword = undefined;
                    }
                } else {
                    // Fallback: Check public.users
                    const { data: existingUser } = await supabaseAdmin
                        .from("users")
                        .select("id")
                        .eq("email", app.email)
                        .single();

                    if (existingUser) {
                        userId = existingUser.id;
                        generatedPassword = undefined;
                    } else {
                        throw new Error("Failed to create user account: " + createError.message);
                    }
                }
            } else {
                userId = userData.user.id;
            }
        }

        // 3. Update Existing User Role (only if we didn't just create them with the role)
        // Actually, the upsert below handles the role update safely for everyone.
        // We can skip the explicit update step and just rely on the upsert below.


        // Critical: Ensure user exists in public.users before creating profile
        // This handles cases where user was in auth but not public (zombie user)
        if (userId) {
            const { error: userSyncError } = await supabaseAdmin
                .from("users")
                .upsert({
                    id: userId,
                    email: app.email,
                    role: 'therapist',
                    name: app.name
                });

            if (userSyncError) console.error("User sync warning:", userSyncError);
        }

        // 2b. Create Therapist Profile
        const { error: profileError } = await supabaseAdmin
            .from("therapist_profiles")
            .insert({
                user_id: userId,
                name: app.name,
                title: app.title,
                bio: app.bio,
                specialties: app.specialties || [], // Array of specialties (Intervention Areas)
                specializations: app.specializations || [], // Roles (Psiholog, Psihiatru)
                medical_code: app.medical_code, // Parafa
                location: app.location,
                price_range: app.price_range,
                languages: app.languages || [],
                education: app.education,
                availability: app.availability,
                verified: true, // Auto-verify upon approval
            });

        if (profileError) {
            console.error("Profile creation error:", profileError);
            if (profileError.code !== '23505') { // unique_violation
                throw new Error("Failed to create profile: " + profileError.message);
            } else {
                // Profile exists, update it with new info
                await supabaseAdmin
                    .from("therapist_profiles")
                    .update({
                        verified: true,
                        specializations: app.specializations || [],
                        medical_code: app.medical_code
                    })
                    .eq("user_id", userId);
            }
        }



        // 4. Update Application Status
        await supabaseAdmin
            .from("therapist_applications")
            .update({ status: "approved" })
            .eq("id", applicationId);

        // 5. Send Email
        try {
            await sendApprovalEmail({
                name: app.name,
                email: app.email,
                type: 'terapeut',
                loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`,
                password: generatedPassword // Will be null if user already existed
            });
        } catch (emailError) {
            console.error("Failed to send approval email:", emailError);
            // Don't fail the request if email fails, but log it
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Approval flow failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
