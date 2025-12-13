"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"client" | "therapist">("client");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Parolele nu se potrivesc");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Parola trebuie să aibă cel puțin 6 caractere");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create account");
            }

            if (data.warning === "EMAIL_RESTRICTED" && data.confirmationLink) {
                // Special handling for Dev Mode
                setSuccess(true);
                // We use the 'error' state to store the warning type temporarily, or better, use a new state
                // Re-using 'error' state here as a flag for the success view to show the link
                // But wait, 'email' state holds the user email. We need to store the link.
                // Let's repurpose 'email' state to hold the link in the success view? No, that's messy.
                // Let's just use the 'email' state variable to hold the link since we don't need the email anymore?
                // Actually, let's just use a new state variable or a hack.
                // The cleanest way is to add a new state, but I can't add state in this tool call easily without replacing the whole file header.
                // I'll use the 'error' state to signal "EMAIL_RESTRICTED" and 'email' state to hold the link.
                setError("EMAIL_RESTRICTED");
                setEmail(data.confirmationLink); // Hack: Store link in email state for display
            } else {
                setSuccess(true);
                setTimeout(() => {
                    const redirectUrl = searchParams.get("redirect");
                    if (redirectUrl) {
                        router.push(`/auth/login?redirect=${redirectUrl}`);
                    } else {
                        router.push("/auth/login");
                    }
                }, 3000);
            }
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-md">
                <div className="rounded-lg border bg-card p-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="font-heading text-2xl font-bold">Cont creat cu succes!</h2>

                    {error === "EMAIL_RESTRICTED" ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-left text-sm space-y-2">
                            <p className="font-bold text-yellow-800">⚠️ Mod Testare (Dev Mode)</p>
                            <p className="text-yellow-700">
                                Email-ul nu a putut fi trimis deoarece domeniul nu este verificat în Resend.
                            </p>
                            <p className="text-yellow-700">
                                Folosește acest link pentru a confirma contul manual:
                            </p>
                            <div className="bg-white p-2 rounded border break-all font-mono text-xs select-all">
                                <a href={email} className="text-blue-600 hover:underline" target="_blank">
                                    {email}
                                </a>
                            </div>
                            <Button asChild className="w-full mt-2" variant="outline">
                                <a href={email}>Confirmă Acum</a>
                            </Button>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            Verifică emailul pentru a-ți activa contul. Vei fi redirecționat către login...
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-md">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="font-heading text-3xl font-bold">Crează cont nou</h1>
                    <p className="text-muted-foreground">
                        Alătură-te platformei Terapie.md
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-sm font-medium">Tip de cont</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole("client")}
                                className={`p-3 rounded-lg border-2 transition-colors text-left ${role === "client"
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <div className="font-medium text-sm">Client</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Caut terapeut
                                </div>
                            </button>

                            <Link
                                href="/aplicare-terapeut"
                                className="p-3 rounded-lg border-2 border-border hover:border-primary/50 transition-colors text-left block"
                            >
                                <div className="font-medium text-sm">Terapeut</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Aplică ca specialist
                                </div>
                            </Link>

                            <Link
                                href="/business/register"
                                className="p-3 rounded-lg border-2 border-border hover:border-primary/50 transition-colors text-left block"
                            >
                                <div className="font-medium text-sm">Business</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Oferte wellness
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Nume Public (pentru programări și recenzii)
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Ex: Ion Popescu"
                        />
                    </div>

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
                            placeholder="Minimum 6 caractere"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirmă parola
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

                    <div className="text-xs text-muted-foreground">
                        Prin crearea contului, accepți{" "}
                        <Link href="/termeni" className="text-primary hover:underline">
                            Termenii și condițiile
                        </Link>{" "}
                        și{" "}
                        <Link href="/confidentialitate" className="text-primary hover:underline">
                            Politica de confidențialitate
                        </Link>
                        .
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Se creează contul..." : "Creează cont"}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Ai deja cont?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline font-medium">
                        Intră în cont
                    </Link>
                </div>
            </div>
        </div>
    );
}
