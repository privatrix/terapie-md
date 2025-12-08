"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Check if user actually needs to change password
        const checkPasswordStatus = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            // If user doesn't need password change, redirect to dashboard
            if (!user.user_metadata?.requires_password_change) {
                router.push("/dashboard");
            }
        };

        checkPasswordStatus();
    }, [router]);

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return "Parola trebuie să aibă cel puțin 8 caractere";
        }
        if (!/[A-Z]/.test(password)) {
            return "Parola trebuie să conțină cel puțin o literă mare";
        }
        if (!/[a-z]/.test(password)) {
            return "Parola trebuie să conțină cel puțin o literă mică";
        }
        if (!/[0-9]/.test(password)) {
            return "Parola trebuie să conțină cel puțin o cifră";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (newPassword !== confirmPassword) {
            setError("Parolele nu se potrivesc");
            return;
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();

            // 1. Update the password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            // 2. Remove the requires_password_change flag
            const { error: metadataError } = await supabase.auth.updateUser({
                data: {
                    requires_password_change: false
                }
            });

            if (metadataError) {
                console.error("Metadata update error:", metadataError);
            }

            alert("Parola a fost schimbată cu succes!");
            router.push("/dashboard");

        } catch (error: any) {
            console.error("Password change error:", error);
            setError(error.message || "Eroare la schimbarea parolei");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-2xl">Schimbă Parola</CardTitle>
                    <CardDescription>
                        Pentru securitatea contului, trebuie să schimbați parola temporară cu una nouă.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">Parola Temporară</Label>
                            <div className="relative">
                                <Input
                                    id="current"
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Introduceți parola temporară"
                                    required
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new">Parolă Nouă</Label>
                            <div className="relative">
                                <Input
                                    id="new"
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Introduceți parola nouă"
                                    required
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Minim 8 caractere, cu litere mari, mici și cifre
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirmă Parola</Label>
                            <div className="relative">
                                <Input
                                    id="confirm"
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirmați parola nouă"
                                    required
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Se schimbă parola...
                                </>
                            ) : (
                                "Schimbă Parola"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
