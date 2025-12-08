import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, subject, message } = await request.json();

        if (!process.env.RESEND_API_KEY) {
            console.warn("RESEND_API_KEY is not set");
            return NextResponse.json({ success: true, warning: "Email configuration missing" });
        }

        const { data, error } = await resend.emails.send({
            from: 'Terapie.md <onboarding@resend.dev>', // Default Resend testing domain
            to: ['contact@terapie.md'], // Ideally this should be an env var too
            subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
            html: `
        <h2>New Message from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
            <p>${message}</p>
        </div>
      `,
            replyTo: email,
        });

        if (error) {
            console.error("Resend Error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
