"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ForcePasswordChange() {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (user && user.user_metadata?.requires_password_change) {
                    if (pathname !== "/change-password" && pathname !== "/auth/change-password") {
                        router.replace("/change-password");
                    }
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        // Optional: Listen for auth state changes
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user?.user_metadata?.requires_password_change) {
                if (pathname !== "/change-password" && pathname !== "/auth/change-password") {
                    router.replace("/change-password");
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    return null; // This component doesn't render anything visible
}
