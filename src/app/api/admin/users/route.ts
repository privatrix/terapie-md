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

        // Manually delete related records to bypass potential FK constraint issues
        // 1. Delete Therapist Application
        await supabaseAdmin.from('therapist_applications').delete().eq('user_id', id);
        // 2. Delete Therapist Profile
        await supabaseAdmin.from('therapist_profiles').delete().eq('id', id); // Logic assumes profile ID might match user ID or has FK
        await supabaseAdmin.from('therapist_profiles').delete().eq('user_id', id); // Safer check
        // 3. Delete Bookings (as client or therapist)
        await supabaseAdmin.from('bookings').delete().eq('client_id', id);
        await supabaseAdmin.from('bookings').delete().eq('therapist_id', id);
        // 4. Delete Reviews
        await supabaseAdmin.from('reviews').delete().eq('client_id', id);
        await supabaseAdmin.from('reviews').delete().eq('therapist_id', id);
        // 5. Delete Business Profile
        await supabaseAdmin.from('business_profiles').delete().eq('owner_id', id);
        // 6. Delete Contact Submissions (if any linked to email/user?) - usually email based but good to check if we tracked user_id
        // (Assuming checking by email might be risky if we don't have user_id there, so better to skip unless sure. 
        // But better: checks for any other tables? Notifications? Favorites?)
        await supabaseAdmin.from('favorites').delete().eq('user_id', id);
        await supabaseAdmin.from('notifications').delete().eq('user_id', id);

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
