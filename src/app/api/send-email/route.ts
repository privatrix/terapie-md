import { NextRequest, NextResponse } from 'next/server';
import { sendApprovalEmail, sendDocumentRequestEmail, sendRejectionEmail, sendReplyEmail } from '@/lib/email';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        // ... (auth checks commented out)

        const body = await request.json();
        const { type, data } = body;

        let result;

        switch (type) {
            case 'approval':
                result = await sendApprovalEmail(data);
                break;
            case 'document-request':
                result = await sendDocumentRequestEmail(data);
                break;
            case 'rejection':
                result = await sendRejectionEmail(data);
                break;
            case 'reply':
                result = await sendReplyEmail(data);
                break;
            default:
                return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
        }

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('Email sending error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
