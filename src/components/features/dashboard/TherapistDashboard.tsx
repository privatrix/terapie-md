"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Edit, X, Check, XCircle, MessageSquare, Calendar, Clock, LogOut, FileText, Bell, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { uploadProfilePhoto, deleteProfilePhoto, updateTherapistPhoto } from "@/lib/storage";
import { BookingChat } from "@/components/features/bookings/BookingChat";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShareButton } from "@/components/common/ShareButton";
import { Skeleton } from "@/components/ui/skeleton";

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
            // Fetch appointments using the profile ID
            const { data: appointmentsData } = await supabase
                .from("bookings")
                .select(`
                    *,
                    client:users!client_id(email, name),
                    messages:booking_messages(id, read_at, sender_id)
                `)
                .eq("therapist_id", profileData.id)
                .order("created_at", { ascending: false });

            // Process bookings to add unread count
            const bookingsWithUnread = appointmentsData?.map((booking: any) => {
                const unreadCount = booking.messages?.filter(
                    (m: any) => m.read_at === null && m.sender_id !== user.id
                ).length || 0;
                return { ...booking, unreadCount };
            });

            setAppointments(bookingsWithUnread || []);
        }

        setProfile(profileData);
        setLoading(false);
    };

    const PROFESSIONAL_ROLES = [
        "Psiholog Clinician",
        "Psihoterapeut",
        "Consilier",
        "Coach",
        "Psihiatru"
    ];

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

    // ... inside render ...

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

        {/* Specializations (Roles) - Replacing simple Title input */}
        <div>
            <label className="text-sm font-medium">Tip Specialist (Roluri)</label>
            {editing ? (
                <div className="mt-1 flex flex-wrap gap-2">
                    {PROFESSIONAL_ROLES.map((role) => {
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

    {/* Medical Code - Conditional */ }
    {
        (profile.specializations?.includes("Psihiatru") || profile.medical_code) && (
            <div>
                <label className="text-sm font-medium">Cod Parafă (Medical Code)</label>
                {editing ? (
                    <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={profile.medical_code || ""}
                        onChange={(e) => setProfile({ ...profile, medical_code: e.target.value })}
                        placeholder="Ex: 123456"
                    />
                ) : (
                    <p className="text-muted-foreground mt-1">{profile.medical_code || "Nu este setat"}</p>
                )}
            </div>
        )
    }

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
                                <input
                                    type="text"
                                    className="w-full mt-1 px-3 py-2 border rounded-md"
                                    value={profile.location || ""}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                />
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

                    <div>
                        <label className="text-sm font-medium">Disponibilitate</label>
                        {editing ? (
                            <input
                                type="text"
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                value={profile.availability || ""}
                                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                                placeholder="Luni - Vineri: 10:00 - 18:00"
                            />
                        ) : (
                            <p className="text-muted-foreground mt-1">{profile.availability}</p>
                        )}
                    </div>


                </CardContent >
            </Card >

        {/* Availability Management - Dedicated Card */ }
        < Card >
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Programul Meu</CardTitle>
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
                </CardHeader>
                <CardContent>
                    <div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Configurează programul pentru fiecare zi a săptămânii.
                        </p>

                        {editingSchedule ? (
                            <div className="space-y-6">
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                    const dayNames: Record<string, string> = {
                                        monday: 'Luni', tuesday: 'Marți', wednesday: 'Miercuri',
                                        thursday: 'Joi', friday: 'Vineri', saturday: 'Sâmbătă', sunday: 'Duminică'
                                    };

                                    const schedule = profile.weekly_schedule?.[day] || { active: false, slots: [] };

                                    return (
                                        <div key={day} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="font-medium">{dayNames[day]}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">
                                                        {schedule.active ? 'Activ' : 'Inactiv'}
                                                    </span>
                                                    <Button
                                                        variant={schedule.active ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => {
                                                            const newSchedule = {
                                                                ...profile.weekly_schedule,
                                                                [day]: { ...schedule, active: !schedule.active }
                                                            };
                                                            setProfile({ ...profile, weekly_schedule: newSchedule });
                                                        }}
                                                    >
                                                        {schedule.active ? 'Oprit' : 'Pornit'}
                                                    </Button>
                                                </div>
                                            </div>

                                            {schedule.active && (
                                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                                    {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => {
                                                        const time = `${hour.toString().padStart(2, '0')}:00`;
                                                        const isSelected = schedule.slots?.includes(time);
                                                        return (
                                                            <div
                                                                key={time}
                                                                onClick={() => {
                                                                    const currentSlots = schedule.slots || [];
                                                                    const newSlots = isSelected
                                                                        ? currentSlots.filter((s: string) => s !== time)
                                                                        : [...currentSlots, time].sort();

                                                                    const newSchedule = {
                                                                        ...profile.weekly_schedule,
                                                                        [day]: { ...schedule, slots: newSlots }
                                                                    };
                                                                    setProfile({ ...profile, weekly_schedule: newSchedule });
                                                                }}
                                                                className={`
                                                                    cursor-pointer text-center py-2 px-1 rounded-md text-sm border transition-colors
                                                                    ${isSelected
                                                                        ? "bg-primary text-primary-foreground border-primary"
                                                                        : "bg-background hover:bg-muted border-input"}
                                                                `}
                                                            >
                                                                {time}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
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

                                    return (
                                        <div key={day} className="flex items-start gap-2">
                                            <span className="w-20 font-medium text-sm pt-1">{dayNames[day]}:</span>
                                            <div className="flex flex-wrap gap-1 flex-1">
                                                {schedule.slots?.length > 0 ? (
                                                    schedule.slots.sort().map((slot: string) => (
                                                        <Badge key={slot} variant="outline" className="text-xs">{slot}</Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Fără intervale</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {!profile.weekly_schedule && (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {profile.available_slots?.sort().map((slot: string) => (
                                            <Badge key={slot} variant="outline" className="text-sm py-1 px-3">{slot}</Badge>
                                        )) || <p className="text-muted-foreground">Nu sunt intervale setate</p>}
                                    </div>
                                )}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-4">
                            * Programările confirmate vor bloca automat intervalul respectiv pentru data specifică.
                        </p>
                    </div>
                </CardContent>
            </Card >

        {/* Notification Settings */ }
        < Card >
                <CardHeader>
                    <CardTitle>Setări Notificări</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium">Notificări Email</label>
                            <p className="text-sm text-muted-foreground">
                                Primește emailuri când primești mesaje noi de la clienți.
                            </p>
                        </div>
                        <Button
                            variant={profile.user?.notification_preferences?.email_booking !== false ? "default" : "outline"}
                            onClick={async () => {
                                const current = profile.user?.notification_preferences?.email_booking !== false;
                                const supabase = createClient();
                                const { error } = await supabase
                                    .from("users")
                                    .update({
                                        notification_preferences: {
                                            ...profile.user?.notification_preferences,
                                            email_booking: !current
                                        }
                                    })
                                    .eq("id", user.id);

                                if (!error) {
                                    setProfile({
                                        ...profile,
                                        user: {
                                            ...profile.user,
                                            notification_preferences: {
                                                ...profile.user?.notification_preferences,
                                                email_booking: !current
                                            }
                                        }
                                    });
                                }
                            }}
                        >
                            {profile.user?.notification_preferences?.email_booking !== false ? "Activat" : "Dezactivat"}
                        </Button>
                    </div>
                </CardContent>
            </Card >

        {/* Upcoming Appointments */ }
        < Card >
                <CardHeader>
                    <CardTitle>Programări ({appointments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {appointments.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">Nu ai programări viitoare.</p>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((apt) => (
                                <div key={apt.id} className="flex justify-between items-center p-4 border rounded-lg">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{apt.client?.name || apt.client?.email || "Client"}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
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
                </CardContent>
            </Card >

        <Dialog open={!!selectedBookingForChat} onOpenChange={(open) => {
            if (!open) {
                setSelectedBookingForChat(null);
                window.location.reload();
            }
        }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Chat cu {selectedBookingForChat?.client?.email || "Client"}</DialogTitle>
                </DialogHeader>
                {selectedBookingForChat && (
                    <BookingChat
                        bookingId={selectedBookingForChat.id}
                        currentUserId={user.id}
                        otherUserName={selectedBookingForChat.client?.email || "Client"}
                    />
                )}
            </DialogContent>
        </Dialog>
        </div >
    );
}
