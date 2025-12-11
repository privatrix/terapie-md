
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    console.log("--- START DEBUG ---");
    console.log("API Key:", process.env.RESEND_API_KEY ? "Present" : "Missing");

    try {
        const { data, error } = await resend.emails.send({
            from: 'Terapie.md <noreply@terapie.md>',
            to: ['alexandrufedco@icloud.com'],
            subject: 'Test Email Debug 2',
            html: '<p>This is a test email to verify Resend configuration.</p>'
        });

        if (error) {
            console.error("Resend Error:", JSON.stringify(error, null, 2));
        } else {
            console.log("Resend Success:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Unexpected Error:", e);
    }
    console.log("--- END DEBUG ---");
}

testEmail();
