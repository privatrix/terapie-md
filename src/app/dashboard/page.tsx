"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ClientDashboard } from "@/components/features/dashboard/ClientDashboard";
import { TherapistDashboard } from "@/components/features/dashboard/TherapistDashboard";
import { BusinessDashboard } from "@/components/features/dashboard/BusinessDashboard";
import { AdminDashboard } from "@/components/features/dashboard/AdminDashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<"client" | "therapist" | "business" | "admin" | null>(null);
    const [loading, setLoading] = useState(true);
    const [debugError, setDebugError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();

            // Check session
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/auth/login");
                return;
            }

            setUser(session.user);

            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                setRole("client"); // Default for demo
                setLoading(false);
                return;
            }

            // 1. Check if user is in 'users' table with a specific role
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("role")
                .eq("id", session.user.id)
                .single();

            if (userError) {
                console.error("Error fetching user role:", userError);
                setDebugError(userError.message);
            }

            if (userData?.role) {
                setRole(userData.role);
            } else {
                // Fallback: Check if they have a therapist profile
                const { data: therapistProfile } = await supabase
                    .from("therapist_profiles")
                    .select("id")
                    .eq("user_id", session.user.id)
                    .single();

                if (therapistProfile) {
                    setRole("therapist");
                } else {
                    // Check for business profile
                    const { data: businessProfile } = await supabase
                        .from("business_profiles")
                        .select("id")
                        .eq("user_id", session.user.id)
                        .single();

                    if (businessProfile) {
                        setRole("business");
                    } else {
                        setRole("client");
                    }
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">


            {role === "admin" ? (
                <AdminDashboard user={user} />
            ) : role === "therapist" ? (
                <TherapistDashboard user={user} />
            ) : role === "business" ? (
                <BusinessDashboard user={user} />
            ) : (
                <ClientDashboard user={user} />
            )}
        </div>
    );
}
