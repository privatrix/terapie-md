"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [recoveryData, setRecoveryData] = useState<{ access_token: string, refresh_token: string } | null>(null);
    const [sessionReady, setSessionReady] = useState(false);

    // Capture hash parameters immediately on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;
            const search = window.location.search;

            const extractTokens = (str: string) => {
                const params = new URLSearchParams(str.startsWith('#') || str.startsWith('?') ? str.substring(1) : str);
                const access_token = params.get('access_token');
                const refresh_token = params.get('refresh_token');
                return access_token && refresh_token ? { access_token, refresh_token } : null;
            };

            const hashTokens = extractTokens(hash);
            const queryTokens = extractTokens(search);
            const tokens = hashTokens || queryTokens;

            if (tokens) {
                console.log("Tokens captured from URL");
                setRecoveryData(tokens);
            }
        }
    }, []);

    useEffect(() => {
        const supabase = createClient();

        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                console.log("Session active on mount");
                setSessionReady(true);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth event:", event);
            if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
                setSessionReady(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Parolele nu coincid.");
            return;
        }

        if (password.length < 6) {
            setError("Parola trebuie să aibă cel puțin 6 caractere.");
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();

            // 1. Try to get current session natively
            let { data: { session } } = await supabase.auth.getSession();

            // 2. If no session, try to use captured tokens (Failsafe)
            if (!session && recoveryData) {
                console.log("Attempting manual recovery with captured tokens...");
                const { data, error: setSessionError } = await supabase.auth.setSession({
                    access_token: recoveryData.access_token,
                    refresh_token: recoveryData.refresh_token
                });

                if (!setSessionError && data.session) {
                    session = data.session;
                    console.log("Session recovered via captured tokens");
                } else {
                    console.error("Failed to set session from tokens:", setSessionError);
                }
            }

            // 3. Fallback: Check active URL hash again
            if (!session && typeof window !== 'undefined' && window.location.hash) {
                const params = new URLSearchParams(window.location.hash.substring(1));
                const access_token = params.get('access_token');
                const refresh_token = params.get('refresh_token');
                if (access_token && refresh_token) {
                    const { data } = await supabase.auth.setSession({ access_token, refresh_token });
                    if (data.session) session = data.session;
                }
            }

            if (!session) {
                throw new Error("Link-ul a expirat sau este invalid. Te rugăm să soliciți o nouă resetare a parolei.");
            }

            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err: any) {
            console.error("Update password error:", err);
            setError(err.message || "A apărut o eroare. Încearcă din nou.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-md">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="font-heading text-3xl font-bold">Setare Parolă Nouă</h1>
                    <p className="text-muted-foreground">
                        Introdu noua parolă pentru contul tău.
                    </p>
                </div>

                {success ? (
                    <div className="rounded-xl border bg-card p-6 text-center space-y-4">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">Parolă actualizată!</h3>
                            <p className="text-sm text-muted-foreground">
                                Parola ta a fost schimbată cu succes. Acum te poți autentifica.
                            </p>
                        </div>
                        <Button asChild className="w-full">
                            <Link href="/auth/login">Mergi la Autentificare</Link>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Parolă Nouă
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

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirmă Parola
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Se actualizează..." : "Actualizează Parola"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
