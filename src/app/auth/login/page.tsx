"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            const { data: { user } } = await supabase.auth.getUser();

            if (user?.user_metadata?.requires_password_change) {
                router.push("/change-password");
            } else {
                const redirectUrl = searchParams.get("redirect") || "/";
                // Force full reload to ensure auth state is picked up
                window.location.assign(redirectUrl);
            }
            // router.refresh(); // Not needed with window.location.assign
        } catch (err: any) {
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-md">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="font-heading text-3xl font-bold">Intră în cont</h1>
                    <p className="text-muted-foreground">
                        Bine ai revenit! Introdu datele tale pentru a continua.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="email@exemplu.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Parolă
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-muted-foreground">Ține-mă minte</span>
                        </label>
                        <Link
                            href="/auth/reset-password"
                            className="text-primary hover:underline"
                        >
                            Ai uitat parola?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Se încarcă..." : "Intră în cont"}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Nu ai cont?{" "}
                    <Link
                        href={`/auth/signup${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""}`}
                        className="text-primary hover:underline font-medium"
                    >
                        Creează cont nou
                    </Link>
                </div>
            </div>
        </div>
    );
}
