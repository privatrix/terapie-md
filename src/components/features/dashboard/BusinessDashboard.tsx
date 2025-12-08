"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Save, X, Trash2, Check, XCircle, User, Calendar, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ShareButton } from "@/components/common/ShareButton";
import { BookingChat } from "@/components/features/bookings/BookingChat";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function BusinessDashboard({ user }: { user: any }) {
    const [profile, setProfile] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedBookingForChat, setSelectedBookingForChat] = useState<any>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchData();

        const supabase = createClient();
        const channel = supabase
            .channel('business_dashboard_messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'booking_messages'
                },
                (payload) => {
                    const newMessage = payload.new as any;

                    // Update appointments state to increment unread count if message is not from current user
                    setAppointments((prevAppointments) =>
                        prevAppointments.map(apt => {
                            if (apt.id === newMessage.booking_id && newMessage.sender_id !== user.id) {
                                return {
                                    ...apt,
                                    unreadCount: (apt.unreadCount || 0) + 1
                                };
                            }
                            return apt;
                        })
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user.id]);

    const fetchData = async () => {
        const supabase = createClient();

        // Fetch business profile
        const { data: profileData } = await supabase
            .from("business_profiles")
            .select(`
                *,
                user:users!user_id(notification_preferences)
            `)
            .eq("user_id", user.id)
            .single();

        if (profileData) {
            setProfile(profileData);

            // Fetch offers
            const { data: offersData } = await supabase
                .from("offers")
                .select("*")
                .eq("business_id", profileData.id)
                .order("created_at", { ascending: false });

            setOffers(offersData || []);

            // Fetch bookings
            const { data: bookingsData } = await supabase
                .from("bookings")
                .select(`
                    *,
                    client:users!client_id(email, name),
                    offer:offers(title),
                    messages:booking_messages(id, read_at, sender_id)
                `)
                .eq("business_id", profileData.id)
                .order("created_at", { ascending: false });

            const bookingsWithUnread = (bookingsData || []).map((booking: any) => {
                const unreadCount = booking.messages?.filter(
                    (m: any) => m.read_at === null && m.sender_id !== user.id
                ).length || 0;
                return { ...booking, unreadCount };
            });

            setAppointments(bookingsWithUnread);
        }

        setLoading(false);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from("business_profiles")
                .update({
                    company_name: profile.company_name,
                    description: profile.description,
                    website: profile.website,
                    location: profile.location,
                    contact_email: profile.contact_email,
                    contact_phone: profile.contact_phone,
                    logo_url: profile.logo_url
                })
                .eq("user_id", user.id);

            if (error) throw error;

            alert("Profil actualizat cu succes!");
            setEditing(false);
        } catch (error: any) {
            console.error("Error updating profile:", error);
            alert(`Eroare: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteOffer = async (offerId: string) => {
        if (!confirm("Sigur doriți să ștergeți această ofertă?")) return;

        const supabase = createClient();
        try {
            const { error } = await supabase
                .from("offers")
                .delete()
                .eq("id", offerId);

            if (error) throw error;

            setOffers(offers.filter(o => o.id !== offerId));
        } catch (error: any) {
            console.error("Error deleting offer:", error);
            alert(`Eroare: ${error.message}`);
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

            alert(`Programare ${status === 'confirmed' ? 'confirmată' : status === 'completed' ? 'finalizată' : 'respinsă'} cu succes!`);
        } catch (error) {
            console.error("Error updating booking:", error);
            alert("A apărut o eroare.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Profil Incomplet</h2>
                <p className="text-muted-foreground mb-4">
                    Nu am găsit un profil de business asociat acestui cont.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Panou Business</h2>
                <Badge variant={profile.verified ? "default" : "secondary"}>
                    {profile.verified ? "Verificat" : "În așteptare"}
                </Badge>
            </div>

            <Tabs defaultValue="bookings" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="bookings">Programări</TabsTrigger>
                    <TabsTrigger value="offers">Oferte</TabsTrigger>
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="settings">Setări</TabsTrigger>
                </TabsList>

                <TabsContent value="bookings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Programări ({appointments.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {appointments.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">Nu aveți programări încă.</p>
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
                                                <p className="text-sm font-medium mt-1">
                                                    {apt.offer?.title || "Ofertă"}
                                                </p>
                                                {apt.notes && (
                                                    <p className="text-sm text-muted-foreground mt-1">Note: {apt.notes}</p>
                                                )}
                                                <div className="pt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="relative"
                                                        onClick={() => setSelectedBookingForChat(apt)}
                                                    >
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Mesaje
                                                        {apt.unreadCount > 0 && (
                                                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse z-10 shadow-sm border border-white">
                                                                {apt.unreadCount}
                                                            </span>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
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
                                                                const message = prompt("Mesaj pentru client (opțional):");
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
                                                                if (confirm("Marchezi această ședință ca fiind finalizată?")) {
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
                    </Card>
                </TabsContent>

                <TabsContent value="offers" className="space-y-4">
                    {/* Offers Management */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Ofertele Mele ({offers.length})</CardTitle>
                            <Button asChild>
                                <Link href="/oferte/nou">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Adaugă Ofertă
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {offers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Nu aveți nicio ofertă activă. Adăugați prima ofertă pentru a atrage clienți!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {offers.map((offer) => (
                                        <div key={offer.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <h4 className="font-medium">{offer.title}</h4>
                                                <p className="text-sm text-muted-foreground">{offer.price} MDL • {offer.duration}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/oferte/${offer.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <ShareButton
                                                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/oferte/${offer.id}`}
                                                    title={offer.title}
                                                />
                                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteOffer(offer.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profile" className="space-y-4">
                    {/* Profile Management */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Profil Companie</CardTitle>
                            {!editing ? (
                                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editează
                                </Button>
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
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">Nume Companie</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="w-full mt-1 px-3 py-2 border rounded-md"
                                            value={profile.company_name || ""}
                                            onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-muted-foreground mt-1">{profile.company_name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Website</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="w-full mt-1 px-3 py-2 border rounded-md"
                                            value={profile.website || ""}
                                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-muted-foreground mt-1">{profile.website || "-"}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Descriere</label>
                                {editing ? (
                                    <textarea
                                        className="w-full mt-1 px-3 py-2 border rounded-md"
                                        rows={4}
                                        value={profile.description || ""}
                                        onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-muted-foreground mt-1">{profile.description || "-"}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">Email Contact</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="w-full mt-1 px-3 py-2 border rounded-md"
                                            value={profile.contact_email || ""}
                                            onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-muted-foreground mt-1">{profile.contact_email || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Telefon Contact</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="w-full mt-1 px-3 py-2 border rounded-md"
                                            value={profile.contact_phone || ""}
                                            onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-muted-foreground mt-1">{profile.contact_phone || "-"}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Setări Cont</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Notificări Email</label>
                                    <p className="text-sm text-muted-foreground">
                                        Primește emailuri când primești rezervări noi.
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
                    </Card>
                </TabsContent>
            </Tabs>
            <Dialog open={!!selectedBookingForChat} onOpenChange={(open) => {
                if (!open) {
                    setSelectedBookingForChat(null);
                    fetchData(); // Refresh to update unread counts
                }
            }}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chat cu {selectedBookingForChat?.client?.name || selectedBookingForChat?.client?.email || "Client"}</DialogTitle>
                    </DialogHeader>
                    {selectedBookingForChat && (
                        <BookingChat
                            bookingId={selectedBookingForChat.id}
                            currentUserId={user.id}
                            otherUserName={selectedBookingForChat.client?.name || selectedBookingForChat.client?.email || "Client"}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
