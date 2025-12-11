
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function debugResetFlow() {
    console.log("--- START RESET DEBUG ---");
    const email = 'alexandrufedco@icloud.com'; // Target user

    // 1. Init Supabase Admin
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    console.log("Supabase Admin initialized.");

    // 2. Generate Link
    console.log(`Generating link for ${email}...`);
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback?next=/auth/update-password`
        }
    });

    if (error) {
        console.error("Supabase Error:", JSON.stringify(error, null, 2));
        return;
    }

    console.log("Link generated successfully.");
    const link = data.properties?.action_link;
    console.log("Action Link:", link);

    if (!link) {
        console.error("No action link returned!");
        return;
    }

    // 3. Send Email (Inline logic from src/lib/email.ts)
    console.log("Sending email via Resend...");

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <p>RESET LINK DEBUG:</p>
        <a href="${link}">${link}</a>
      </body>
    </html>
  `;

    try {
        const { data: result, error: emailError } = await resend.emails.send({
            from: 'Terapie.md <noreply@terapie.md>',
            to: [email],
            subject: 'DEBUG Resetare Parolă Terapie.md',
            html: htmlContent,
        });

        if (emailError) {
            console.error("Resend Error:", JSON.stringify(emailError, null, 2));
        } else {
            console.log("Email Sent Successfully:", JSON.stringify(result, null, 2));
        }
    } catch (e) {
        console.error("Email Sending Exception:", e);
    }

    console.log("--- END RESET DEBUG ---");
}

debugResetFlow();
