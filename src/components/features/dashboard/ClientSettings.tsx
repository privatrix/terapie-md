"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Trash2, Lock, User, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export function ClientSettings({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        phone: "",
        notification_preferences: {
            email_booking: true,
            email_marketing: false
        }
    });
    const [email, setEmail] = useState(user.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, [user.id]);

    const fetchProfile = async () => {
        const supabase = createClient();

        // Fetch public user data
        const { data, error } = await supabase
            .from("users")
            .select("name, phone, notification_preferences")
            .eq("id", user.id)
            .single();

        if (data) {
            setProfile({
                name: data.name || "",
                phone: data.phone || "",
                notification_preferences: data.notification_preferences || {
                    email_booking: true,
                    email_marketing: false
                }
            });
        }

        // If name is missing in DB but present in auth metadata, use that
        if (!data?.name && user.user_metadata?.name) {
            setProfile(prev => ({ ...prev, name: user.user_metadata.name }));
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from("users")
                .update({
                    name: profile.name,
                    phone: profile.phone,
                    notification_preferences: profile.notification_preferences
                })
                .eq("id", user.id);

            if (error) throw error;

            // Also update auth metadata for consistency
            await supabase.auth.updateUser({
                data: { name: profile.name }
            });

            alert("Profil actualizat cu succes!");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            alert("Eroare la actualizarea profilului.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (password !== confirmPassword) {
            alert("Parolele nu se potrivesc!");
            return;
        }
        if (password.length < 6) {
            alert("Parola trebuie să aibă minim 6 caractere.");
            return;
        }

        setLoading(true);
        const supabase = createClient();

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            alert("Parola a fost schimbată cu succes!");
            setPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            console.error("Error updating password:", error);
            alert(`Eroare: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (email === user.email) return;

        setLoading(true);
        const supabase = createClient();

        try {
            const { error } = await supabase.auth.updateUser({
                email: email
            });

            if (error) throw error;

            alert("Un email de confirmare a fost trimis la noua adresă. Te rugăm să confirmi modificarea.");
        } catch (error: any) {
            console.error("Error updating email:", error);
            alert(`Eroare: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmText = prompt("Pentru a șterge contul, scrie 'STERGE' în căsuța de mai jos:");
        if (confirmText !== "STERGE") return;

        setLoading(true);
        const supabase = createClient();

        try {
            // In a real app, you might want to soft-delete or call an admin function
            // Supabase client SDK doesn't allow deleting own user easily without admin
            // We'll call an API route for this
            const response = await fetch("/api/auth/delete-account", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to delete account");
            }

            await supabase.auth.signOut();
            router.push("/");
            alert("Contul a fost șters.");
        } catch (error: any) {
            console.error("Error deleting account:", error);
            alert("Eroare la ștergerea contului. Contactează suportul.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informații Personale
                    </CardTitle>
                    <CardDescription>Gestionează datele tale de identificare</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nume Complet</Label>
                        <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            placeholder="Ion Popescu"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            placeholder="+373..."
                        />
                    </div>
                    <Button onClick={handleUpdateProfile} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvează Modificările
                    </Button>
                </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Securitate
                    </CardTitle>
                    <CardDescription>Gestionează emailul și parola</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button variant="outline" onClick={handleUpdateEmail} disabled={loading || email === user.email}>
                                    Actualizează
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-medium text-sm">Schimbă Parola</h4>
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">Parolă Nouă</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirmă Parola</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleUpdatePassword} disabled={loading || !password}>
                            Schimbă Parola
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notificări
                    </CardTitle>
                    <CardDescription>Alege ce notificări vrei să primești</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Notificări Programări</Label>
                            <p className="text-sm text-muted-foreground">Primește emailuri despre statusul programărilor</p>
                        </div>
                        <Switch
                            checked={profile.notification_preferences.email_booking}
                            onCheckedChange={(checked) => setProfile({
                                ...profile,
                                notification_preferences: { ...profile.notification_preferences, email_booking: checked }
                            })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Noutăți și Oferte</Label>
                            <p className="text-sm text-muted-foreground">Primește noutăți despre platformă și oferte speciale</p>
                        </div>
                        <Switch
                            checked={profile.notification_preferences.email_marketing}
                            onCheckedChange={(checked) => setProfile({
                                ...profile,
                                notification_preferences: { ...profile.notification_preferences, email_marketing: checked }
                            })}
                        />
                    </div>
                    <Button onClick={handleUpdateProfile} disabled={loading} variant="outline" className="mt-2">
                        Salvează Preferințele
                    </Button>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <Trash2 className="h-5 w-5" />
                        Zonă Periculoasă
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Ștergerea contului este ireversibilă. Toate datele tale, inclusiv istoricul programărilor, vor fi șterse permanent.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                        Șterge Contul
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
