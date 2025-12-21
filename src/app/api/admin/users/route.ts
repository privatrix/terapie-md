import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase Admin Client (Service Role)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
    try {
        // Authenticate User
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify role
        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (userData?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Delete the user from Supabase Auth (this usually triggers cascade delete)
        const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (error) {
            console.error("Auth delete failed, trying manual table cleanup...");
            // Fallback: If auth delete fails (rare), try deleting from public.users directly
            // This handles cases where auth user might be gone but public record remains
            const { error: dbError } = await supabaseAdmin
                .from('users')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
