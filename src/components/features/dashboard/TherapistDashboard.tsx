"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DashboardTabsList, DashboardTabsTrigger } from "@/components/dashboard/DashboardTabs";
import { Loader2, Save, Edit, X, Check, XCircle, MessageSquare, Calendar, Clock, LogOut, FileText, Bell, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { uploadProfilePhoto, deleteProfilePhoto, updateTherapistPhoto } from "@/lib/storage";
import { BookingChat } from "@/components/features/bookings/BookingChat";

import { ShareButton } from "@/components/common/ShareButton";
import { AccountSettings } from "@/components/dashboard/AccountSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CITIES, THERAPIST_SPECIALIZATIONS, THERAPIST_SPECIALTIES, THERAPIST_APPROACHES } from "@/lib/constants";

export function TherapistDashboard({ user }: { user: any }) {
    const [profile, setProfile] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedBookingForChat, setSelectedBookingForChat] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const supabase = createClient();

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            // Mock data
            setProfile({
                name: "Dr. Elena Popescu",
                title: "Psihoterapeut Integrativ",
                bio: "Cu peste 10 ani de experiență...",
                specialties: ["Anxietate", "Depresie"],
                location: "Chișinău, Centru",
                price_range: "500-700 MDL",
                availability: "Luni - Vineri: 10:00 - 18:00"
            });
            setAppointments([
                {
                    id: "1",
                    client_email: "client@example.com",
                    date: "2024-12-10",
                    time: "14:00",
                    status: "confirmed",
                    notes: "Prima sesiune"
                }
            ]);

            setLoading(false);
            return;
        }

        // Fetch therapist profile with user preferences
        const { data: profileData } = await supabase
            .from("therapist_profiles")
            .select(`
                *,
                user:users!user_id(notification_preferences)
            `)
            .eq("user_id", user.id)
            .single();

        if (profileData) {
            if (profileData) {
                // Fetch appointments securely via API
                try {
                    const response = await fetch('/api/therapist/bookings?t=' + Date.now(), { cache: 'no-store' });
                    if (response.ok) {
                        const appointmentsData = await response.json();
                        // Sort appointments by date descending (newest first)
                        const sortedAppointments = Array.isArray(appointmentsData)
                            ? appointmentsData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            : [];
                        setAppointments(sortedAppointments);
                    } else {
                        console.error("Failed to fetch bookings");
                    }
                } catch (error) {
                    console.error("Error fetching bookings:", error);
                }
            }


        }

        setProfile(profileData);
        setLoading(false);
    };



    const toggleSpecialization = (role: string) => {
        const current = profile.specializations || [];
        const updated = current.includes(role)
            ? current.filter((r: string) => r !== role)
            : [...current, role];

        // Auto-update title
        setProfile({
            ...profile,
            specializations: updated,
            title: updated.join(", ")
        });
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        const supabase = createClient();

        try {
            // Update profile (photo_url is already in profile state if uploaded)
            const { error } = await supabase
                .from("therapist_profiles")
                .update({
                    name: profile.name,
                    title: profile.title,
                    bio: profile.bio,
                    location: profile.location,
                    price_range: profile.price_range,
                    availability: profile.availability,
                    available_slots: profile.available_slots,
                    weekly_schedule: profile.weekly_schedule,
                    photo_url: profile.photo_url,
                    specializations: profile.specializations,
                    medical_code: profile.medical_code
                })
                .eq("user_id", user.id);

            if (error) throw error;

            alert("Profil actualizat cu succes!");
            setEditing(false);
        } catch (error: any) {
            console.error("Error updating profile:", error);
            alert(`A apărut o eroare: ${error.message || error}`);
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (file: File) => {
        try {
            const photoUrl = await uploadProfilePhoto(user.id, file);
            await updateTherapistPhoto(user.id, photoUrl);
            setProfile({ ...profile, photo_url: photoUrl });
        } catch (error: any) {
            throw new Error(error.message || 'Eroare la încărcarea fotografiei');
        }
    };

    const handlePhotoDelete = async () => {
        try {
            await deleteProfilePhoto(user.id);
            await updateTherapistPhoto(user.id, null);
            setProfile({ ...profile, photo_url: null });
        } catch (error: any) {
            throw new Error(error.message || 'Eroare la ștergerea fotografiei');
        }
    };

    const handleBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed', reason?: string) => {
        try {
            const response = await fetch("/api/bookings/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, status, reason })
            });

            if (!response.ok) throw new Error("Failed to update booking");

            // Update local state
            setAppointments(appointments.map(apt =>
                apt.id === bookingId ? { ...apt, status } : apt
            ));

            // Fetch fresh data to get unmasked details (if confirmed)
            await fetchData();

            alert(`Programare ${status === 'confirmed' ? 'confirmată' : status === 'completed' ? 'finalizată' : 'respinsă'} cu succes!`);
        } catch (error) {
            console.error("Error updating booking:", error);
            alert("A apărut o eroare.");
        }
    };



    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                {/* Stats Skeleton */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-1/3" />
                        </div>
                    ))}
                </div>
                {/* Main Content Skeleton */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Profil Incomplet</h2>
                <p className="text-muted-foreground mb-4">
                    Nu ai un profil de terapeut creat încă.
                </p>
                <Button onClick={() => router.push("/specialisti")}>
                    Creează Profil
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Salut, {profile?.name?.split(' ')[0] || user.email?.split('@')[0]}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gestionează programările și profilul tău de terapeut.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground hidden md:inline-block bg-gray-100 px-3 py-1 rounded-full">{user.email}</span>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                        Terapeut
                    </Badge>
                </div>
            </div>
            {/* Statistics Section Moved Outside Tabs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <DashboardStatsCard
                    title="Total Programări"
                    value={appointments.length}
                    icon={Calendar}
                    description={`${appointments.filter(a => a.status === 'completed').length} finalizate`}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-50"
                />
                <DashboardStatsCard
                    title="În Așteptare"
                    value={appointments.filter(a => a.status === 'pending').length}
                    icon={Clock}
                    description="Necesită confirmare"
                    iconColor="text-orange-600"
                    iconBgColor="bg-orange-50"
                />
                <DashboardStatsCard
                    title="Confirmate"
                    value={appointments.filter(a => a.status === 'confirmed').length}
                    icon={Check}
                    description="Urmează să aibă loc"
                    iconColor="text-green-600"
                    iconBgColor="bg-green-50"
                />
            </div>

            <Tabs defaultValue="appointments" className="space-y-6">
                <div className="flex items-center justify-between">
                    <DashboardTabsList>
                        <DashboardTabsTrigger value="appointments">Programări</DashboardTabsTrigger>
                        <DashboardTabsTrigger value="profile">Profil</DashboardTabsTrigger>
                        <DashboardTabsTrigger value="settings">Setări</DashboardTabsTrigger>
                    </DashboardTabsList>
                </div>

                <TabsContent value="profile" className="space-y-6">

                    {/* Profile Management */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                            <h2 className="text-2xl font-bold text-gray-900 shrink-0">Profilul Meu</h2>
                            {!editing ? (
                                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                                    <ShareButton
                                        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/terapeuti/${profile.id}`}
                                        title={`Profil Terapeut - ${profile.name}`}
                                    />
                                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editează
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditing(false);
                                            fetchData(); // Reset changes
                                        }}
                                        disabled={saving}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Anulează
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4 mr-2" />
                                        )}
                                        Salvează
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-6">
                            {/* Photo Upload Section */}
                            {editing && (
                                <div className="pb-6 border-b">
                                    <label className="text-sm font-medium block mb-3">Fotografie Profil</label>
                                    <ImageUpload
                                        currentImage={profile.photo_url}
                                        onUpload={handlePhotoUpload}
                                        onDelete={handlePhotoDelete}
                                        disabled={saving}
                                    />
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">Nume</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="w-full mt-1 px-3 py-2 border rounded-md"
                                            value={profile.name || ""}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-muted-foreground mt-1">{profile.name}</p>
                                    )}
                                </div>

                                {/* Specializations (Roles) */}
                                <div>
                                    <label className="text-sm font-medium">Tip Specialist (Roluri)</label>
                                    {editing ? (
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {THERAPIST_SPECIALIZATIONS.map((role) => {
                                                const isSelected = profile.specializations?.includes(role);
                                                return (
                                                    <div
                                                        key={role}
                                                        onClick={() => toggleSpecialization(role)}
                                                        className={`
                                                    cursor-pointer px-3 py-1.5 rounded-full text-sm border transition-all
                                                    ${isSelected
                                                                ? "bg-primary text-primary-foreground border-primary"
                                                                : "bg-background hover:bg-muted text-muted-foreground border-input"}
                                                `}
                                                    >
                                                        {role}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground mt-1">
                                            {profile.specializations?.join(", ") || profile.title}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Specialties and Approaches Section */}
                            <div className="space-y-4 border-t border-gray-100 pt-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Arii de Expertiză (Specializări)</label>
                                    {editing ? (
                                        <div className="flex flex-wrap gap-2">
                                            {THERAPIST_SPECIALTIES.map((spec) => {
                                                const currentSpecialties = profile.specialties || [];
                                                const isSelected = currentSpecialties.includes(spec);
                                                return (
                                                    <div
                                                        key={spec}
                                                        onClick={() => {
                                                            const updated = isSelected
                                                                ? currentSpecialties.filter((s: string) => s !== spec)
                                                                : [...currentSpecialties, spec];
                                                            setProfile({ ...profile, specialties: updated });
                                                        }}
                                                        className={`
                                                            cursor-pointer px-3 py-1.5 rounded-full text-sm border transition-all
                                                            ${isSelected
                                                                ? "bg-secondary text-secondary-foreground border-secondary"
                                                                : "bg-background hover:bg-muted text-muted-foreground border-input"}
                                                        `}
                                                    >
                                                        {spec}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {(profile.specialties || [])
                                                // Show anything that is NOT a known approach (defaults to specialty)
                                                .filter((s: string) => !THERAPIST_APPROACHES.includes(s as any))
                                                .map((s: string) => (
                                                    <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
                                                ))}
                                            {(!profile.specialties || profile.specialties.length === 0) && <span className="text-muted-foreground">-</span>}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Abordare Terapeutică</label>
                                    {editing ? (
                                        <div className="flex flex-wrap gap-2">
                                            {THERAPIST_APPROACHES.map((approach) => {
                                                const currentSpecialties = profile.specialties || [];
                                                const isSelected = currentSpecialties.includes(approach);
                                                return (
                                                    <div
                                                        key={approach}
                                                        onClick={() => {
                                                            const updated = isSelected
                                                                ? currentSpecialties.filter((s: string) => s !== approach)
                                                                : [...currentSpecialties, approach];
                                                            setProfile({ ...profile, specialties: updated });
                                                        }}
                                                        className={`
                                                            cursor-pointer px-3 py-1.5 rounded-full text-sm border transition-all
                                                            ${isSelected
                                                                ? "bg-accent text-accent-foreground border-accent font-medium"
                                                                : "bg-background hover:bg-muted text-muted-foreground border-input"}
                                                        `}
                                                    >
                                                        {approach}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {(profile.specialties || [])
                                                .filter((s: string) => THERAPIST_APPROACHES.includes(s as any))
                                                .map((s: string) => (
                                                    <Badge key={s} variant="outline" className="font-normal bg-accent/50">{s}</Badge>
                                                ))}
                                            {(!profile.specialties || !profile.specialties.some((s: string) => THERAPIST_APPROACHES.includes(s as any))) && <span className="text-muted-foreground">-</span>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Medical Code - Conditional */}
                            {(profile.specializations?.includes("Psihiatru") || profile.medical_code) && (
                                <div>
                                    <label className="text-sm font-medium">Cod Parafă (Medical Code)</label>
                                    {editing ? (
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                                value={profile.medical_code || ""}
                                                onChange={(e) => setProfile({ ...profile, medical_code: e.target.value })}
                                                placeholder="Ex: 123456"
                                            />
                                            {!profile.medical_code && <p className="text-xs text-red-500">Obligatoriu pentru Psihiatri</p>}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground mt-1">{profile.medical_code || "Nu este setat"}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium">Bio</label>
                                {editing ? (
                                    <textarea
                                        className="w-full mt-1 px-3 py-2 border rounded-md"
                                        rows={4}
                                        value={profile.bio || ""}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-muted-foreground mt-1">{profile.bio}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">Locație</label>
                                    {editing ? (
                                        <Select
                                            value={profile.location || ""}
                                            onValueChange={(value) => setProfile({ ...profile, location: value })}
                                        >
                                            <SelectTrigger className="w-full mt-1">
                                                <SelectValue placeholder="Selectează orașul" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CITIES.map((city) => (
                                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-muted-foreground mt-1">{profile.location}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Preț pe Ședință</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="w-full mt-1 px-3 py-2 border rounded-md"
                                            value={profile.price_range || ""}
                                            onChange={(e) => setProfile({ ...profile, price_range: e.target.value })}
                                            placeholder="500-700 MDL"
                                        />
                                    ) : (
                                        <p className="text-muted-foreground mt-1">{profile.price_range}</p>
                                    )}
                                </div>
                            </div>


                        </div>
                    </div>

                </TabsContent >

                <TabsContent value="appointments" className="space-y-6">

                    {/* Helper function to generate slots */}
                    {(() => {
                        const generateSlots = (start: string, end: string) => {
                            const slots = [];
                            let [startH, startM] = start.split(':').map(Number);
                            const [endH, endM] = end.split(':').map(Number);

                            let currentH = startH;
                            while (currentH < endH) {
                                slots.push(`${currentH.toString().padStart(2, '0')}:00`);
                                currentH++;
                            }
                            return slots;
                        };

                        return (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Programul Meu de Lucru</h2>
                                    {!editingSchedule ? (
                                        <Button variant="outline" size="sm" onClick={() => setEditingSchedule(true)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editează Programul
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingSchedule(false);
                                                    fetchData(); // Reset changes
                                                }}
                                                disabled={saving}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Anulează
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleSaveProfile}
                                                disabled={saving}
                                            >
                                                {saving ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4 mr-2" />
                                                )}
                                                Salvează
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Setează intervalul orar pentru fiecare zi. Sistemul va genera automat sloturi de 1 oră în acest interval.
                                    </p>

                                    {editingSchedule ? (
                                        <div className="space-y-4 border rounded-md p-4 bg-muted/20">
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                                const dayNames: Record<string, string> = {
                                                    monday: 'Luni', tuesday: 'Marți', wednesday: 'Miercuri',
                                                    thursday: 'Joi', friday: 'Vineri', saturday: 'Sâmbătă', sunday: 'Duminică'
                                                };

                                                const schedule = profile.weekly_schedule?.[day] || { active: false, slots: [] };

                                                // Determine initial Start/End for inputs
                                                let start = "09:00";
                                                let end = "17:00";
                                                if (schedule.slots && schedule.slots.length > 0) {
                                                    const sorted = [...schedule.slots].sort();
                                                    start = sorted[0];
                                                    const last = sorted[sorted.length - 1];
                                                    const [h, m] = last.split(':').map(Number);
                                                    end = `${(h + 1).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                                                }

                                                return (
                                                    <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b last:border-0 border-border/50 gap-2 sm:gap-0">
                                                        <div className="flex items-center space-x-3">
                                                            <Switch
                                                                checked={schedule.active}
                                                                onCheckedChange={(checked) => {
                                                                    const newSchedule = {
                                                                        ...profile.weekly_schedule,
                                                                        [day]: { ...schedule, active: checked }
                                                                    };
                                                                    setProfile({ ...profile, weekly_schedule: newSchedule });
                                                                }}
                                                            />
                                                            <span className={`text-sm ${schedule.active ? "font-medium" : "text-muted-foreground"}`}>
                                                                {dayNames[day]}
                                                            </span>
                                                        </div>
                                                        {schedule.active ? (
                                                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                                <input
                                                                    type="time"
                                                                    defaultValue={start}
                                                                    onBlur={(e) => {
                                                                        const newStart = e.target.value;
                                                                        // Grab the end value from the DOM or state... sticky.
                                                                        // Better to grab the sibling input by navigating DOM to avoid state complexity for now.
                                                                        // This is "good enough" for quick refactor.
                                                                        const container = e.target.parentElement;
                                                                        const inputs = container?.querySelectorAll('input[type="time"]');
                                                                        const currentEnd = (inputs?.[1] as HTMLInputElement)?.value || "17:00";

                                                                        const newSlots = generateSlots(newStart, currentEnd);
                                                                        const newSchedule = {
                                                                            ...profile.weekly_schedule,
                                                                            [day]: { ...schedule, slots: newSlots }
                                                                        };
                                                                        setProfile((prev: any) => ({ ...prev, weekly_schedule: newSchedule }));
                                                                    }}
                                                                    className="h-8 rounded border border-input bg-background px-2 text-xs w-20"
                                                                />
                                                                <span className="text-muted-foreground">-</span>
                                                                <input
                                                                    type="time"
                                                                    defaultValue={end}
                                                                    onBlur={(e) => {
                                                                        const newEnd = e.target.value;
                                                                        const container = e.target.parentElement;
                                                                        const inputs = container?.querySelectorAll('input[type="time"]');
                                                                        const currentStart = (inputs?.[0] as HTMLInputElement)?.value || "09:00";

                                                                        const newSlots = generateSlots(currentStart, newEnd);
                                                                        const newSchedule = {
                                                                            ...profile.weekly_schedule,
                                                                            [day]: { ...schedule, slots: newSlots }
                                                                        };
                                                                        setProfile((prev: any) => ({ ...prev, weekly_schedule: newSchedule }));
                                                                    }}
                                                                    className="h-8 rounded border border-input bg-background px-2 text-xs w-20"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic sm:text-right w-full sm:w-auto">Indisponibil</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                                const dayNames: Record<string, string> = {
                                                    monday: 'Luni', tuesday: 'Marți', wednesday: 'Miercuri',
                                                    thursday: 'Joi', friday: 'Vineri', saturday: 'Sâmbătă', sunday: 'Duminică'
                                                };
                                                const schedule = profile.weekly_schedule?.[day];

                                                if (!schedule?.active) return null;

                                                let timeDisplay = "Toată ziua";
                                                if (schedule.slots && schedule.slots.length > 0) {
                                                    const sorted = [...schedule.slots].sort();
                                                    const start = sorted[0];
                                                    const last = sorted[sorted.length - 1];
                                                    const [h, m] = last.split(':').map(Number);
                                                    const end = `${(h + 1).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                                                    timeDisplay = `${start} - ${end}`;
                                                }

                                                return (
                                                    <div key={day} className="flex items-center justify-between border-b pb-2 last:border-0 border-gray-50">
                                                        <span className="font-medium text-sm text-gray-700">{dayNames[day]}</span>
                                                        <span className="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-full">
                                                            {timeDisplay}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                            {!profile.weekly_schedule && <p className="text-muted-foreground text-sm">Nu este setat programul.</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}


                    {/* Upcoming Appointments */}
                    <div>
                        {appointments.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">Nu ai programări viitoare.</p>
                        ) : (
                            <div className="space-y-4">
                                {appointments.map((apt) => (
                                    <div key={apt.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{apt.client?.name || "Client"}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                {apt.client?.is_masked ? (
                                                    <span className="flex items-center gap-2 text-muted-foreground/50 italic">
                                                        <span className="blur-[3px] select-none">email@example.com</span>
                                                        <span className="text-xs not-italic bg-gray-100 px-2 py-0.5 rounded-full border">Acceptă pentru a vedea</span>
                                                    </span>
                                                ) : (
                                                    <span>{apt.client?.email} {apt.client?.phone ? `• ${apt.client.phone}` : ''}</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {new Date(apt.date).toLocaleDateString()} • {apt.time}
                                            </p>
                                            {apt.notes && (
                                                <p className="text-sm text-muted-foreground mt-1">Note: {apt.notes}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setSelectedBookingForChat(apt)}
                                                title="Mesaje"
                                                className="relative"
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                {apt.unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                                                        {apt.unreadCount}
                                                    </span>
                                                )}
                                            </Button>

                                            <Badge variant={
                                                apt.status === "confirmed" ? "default" :
                                                    apt.status === "cancelled" ? "destructive" :
                                                        apt.status === "completed" ? "outline" : "secondary"
                                            }>
                                                {apt.status === "pending" ? "În așteptare" :
                                                    apt.status === "confirmed" ? "Confirmat" :
                                                        apt.status === "completed" ? "Finalizat" : "Anulat"}
                                            </Badge>

                                            {apt.status === "pending" && (
                                                <div className="flex gap-1 ml-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => {
                                                            const message = prompt("Mesaj pentru client (opțional - ex: adresă, cod acces):");
                                                            if (message !== null) {
                                                                handleBookingStatus(apt.id, 'confirmed', message);
                                                            }
                                                        }}
                                                        title="Confirmă"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            const reason = prompt("Motivul respingerii (opțional):");
                                                            if (reason !== null) {
                                                                handleBookingStatus(apt.id, 'cancelled', reason);
                                                            }
                                                        }}
                                                        title="Respinge"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}

                                            {apt.status === "confirmed" && (
                                                <div className="flex gap-1 ml-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => {
                                                            if (confirm("Marchezi această ședință ca fiind finalizată? Clientul va putea lăsa o recenzie.")) {
                                                                handleBookingStatus(apt.id, 'completed');
                                                            }
                                                        }}
                                                        title="Finalizează"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                        onClick={() => {
                                                            const message = prompt("Mesaj pentru reprogramare (ex: Motivul, când sunteți disponibil):");
                                                            if (message !== null) {
                                                                handleBookingStatus(apt.id, 'cancelled', `Solicitare reprogramare: ${message}`);
                                                            }
                                                        }}
                                                        title="Reprogramează (Cere clientului să refacă programarea)"
                                                    >
                                                        <Calendar className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            const reason = prompt("Motivul anulării:");
                                                            if (reason !== null) {
                                                                handleBookingStatus(apt.id, 'cancelled', reason);
                                                            }
                                                        }}
                                                        title="Anulează"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                    <AccountSettings user={user} />
                </TabsContent>
            </Tabs >
            <Dialog open={!!selectedBookingForChat} onOpenChange={(open) => {
                if (!open) {
                    setSelectedBookingForChat(null);
                    window.location.reload();
                }
            }}>
                <DialogContent className="w-[95vw] max-w-[500px] p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="p-4 border-b bg-muted/50">
                        <DialogTitle className="text-base">Chat cu {selectedBookingForChat?.client?.email || "Client"}</DialogTitle>
                    </DialogHeader>
                    {selectedBookingForChat && (
                        <BookingChat
                            bookingId={selectedBookingForChat.id}
                            currentUserId={user.id}
                            otherUserName={selectedBookingForChat.client?.email || "Client"}
                            className="border-0 rounded-none h-[500px]"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}
