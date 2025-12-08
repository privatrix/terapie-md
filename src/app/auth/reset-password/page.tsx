"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "A apărut o eroare. Încearcă din nou.");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "A apărut o eroare. Încearcă din nou.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-md">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="font-heading text-3xl font-bold">Resetare Parolă</h1>
                    <p className="text-muted-foreground">
                        Introdu adresa de email pentru a primi instrucțiunile de resetare.
                    </p>
                </div>

                {success ? (
                    <div className="rounded-xl border bg-card p-6 text-center space-y-4">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">Verifică-ți emailul</h3>
                            <p className="text-sm text-muted-foreground">
                                Ți-am trimis un link de resetare la <strong>{email}</strong>.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/auth/login">Înapoi la Autentificare</Link>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
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

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Se trimite..." : "Trimite Link Resetare"}
                        </Button>

                        <div className="text-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Înapoi la Autentificare
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
