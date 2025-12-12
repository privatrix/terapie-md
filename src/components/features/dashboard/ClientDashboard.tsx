"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";
import { ReviewModal } from "@/components/features/reviews/ReviewModal";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DashboardTabsList, DashboardTabsTrigger } from "@/components/dashboard/DashboardTabs";
import { AccountSettings } from "@/components/dashboard/AccountSettings";
import { MessageSquare, Settings, Calendar as CalendarIcon } from "lucide-react";
import { BookingChat } from "@/components/features/bookings/BookingChat";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ClientDashboard({ user }: { user: any }) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
    const [selectedBookingForChat, setSelectedBookingForChat] = useState<any>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const supabase = createClient();

            // Mock data if Supabase not configured
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                setBookings([
                    {
                        id: "1",
                        date: "2024-03-20",
                        time: "14:00",
                        status: "confirmed",
                        therapist: {
                            name: "Dr. Elena Popescu",
                            location: "Chișinău, Centru"
                        }
                    }
                ]);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("bookings")
                .select(`
          *,
          therapist:therapist_profiles(name, location),
          business:business_profiles(company_name),
          offer:offers(title),
          messages:booking_messages(id, read_at, sender_id)
        `)
                .eq("client_id", user.id)
                .order("date", { ascending: true });

            if (!error && data) {
                // Process bookings to add unread count
                const bookingsWithUnread = data.map((booking: any) => {
                    const unreadCount = booking.messages?.filter(
                        (m: any) => m.read_at === null && m.sender_id !== user.id
                    ).length || 0;
                    return { ...booking, unreadCount };
                });
                setBookings(bookingsWithUnread);
            }
            setLoading(false);
        };

        fetchBookings();
    }, [user.id]);

    const handleCancel = async (bookingId: string) => {
        try {
            const response = await fetch("/api/bookings/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId,
                    status: "cancelled",
                    reason: "Anulat de client"
                })
            });

            if (!response.ok) throw new Error("Failed to cancel booking");

            // Refresh bookings
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: "cancelled" } : b
            ));

            alert("Programarea a fost anulată cu succes.");
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert("Nu s-a putut anula programarea.");
        }
    };

    const handleReviewSubmit = async (rating: number, comment: string) => {
        if (!selectedBookingForReview) return;

        try {
            const response = await fetch("/api/reviews/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId: selectedBookingForReview.id,
                    therapistId: selectedBookingForReview.therapist_id,
                    businessId: selectedBookingForReview.business_id, // Add business_id
                    rating,
                    comment
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to submit review");
            }

            alert("Recenzia a fost trimisă cu succes!");
            setReviewModalOpen(false);
            setSelectedBookingForReview(null);
        } catch (error: any) {
            console.error("Error submitting review:", error);
            alert(`Eroare: ${error.message}`);
        }
    };

    if (loading) return <div>Se încarcă...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Panou Client</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground hidden md:inline-block">{user?.email}</span>
                    <Badge variant="secondary">Client</Badge>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <DashboardStatsCard
                    title="Total Programări"
                    value={bookings.length}
                    icon={CalendarIcon}
                    description="Istoric complet"
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-50"
                />
                <DashboardStatsCard
                    title="Confirmate"
                    value={bookings.filter(b => b.status === "confirmed").length}
                    icon={Clock}
                    description="Viitoare"
                    iconColor="text-green-600"
                    iconBgColor="bg-green-50"
                />
                <DashboardStatsCard
                    title="Mesaje Noi"
                    value={bookings.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0)}
                    icon={MessageSquare}
                    description="Mesaje necitite"
                    iconColor="text-pink-600"
                    iconBgColor="bg-pink-50"
                />
            </div>

            <Tabs defaultValue="bookings" className="w-full">
                <DashboardTabsList className="mb-6">
                    <DashboardTabsTrigger value="bookings" className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Programări
                    </DashboardTabsTrigger>
                    <DashboardTabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Setări Cont
                    </DashboardTabsTrigger>
                </DashboardTabsList>

                <TabsContent value="bookings" className="mt-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Programări</h2>
                        </div>
                        {bookings.length === 0 ? (
                            <DashboardEmptyState
                                icon={CalendarIcon}
                                title="Nu ai nicio programare"
                                description="Programează-te la un terapeut pentru a începe."
                            />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {bookings.map((booking) => (
                                    <Card key={booking.id} className="border-gray-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg font-medium">
                                                    {booking.offer?.title || booking.therapist?.name || booking.business?.company_name || "Terapeut"}
                                                </CardTitle>
                                                {booking.offer?.title && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {booking.therapist?.name || booking.business?.company_name}
                                                    </div>
                                                )}
                                                <Badge variant={
                                                    booking.status === "confirmed" ? "default" :
                                                        booking.status === "cancelled" ? "destructive" :
                                                            booking.status === "completed" ? "outline" : "secondary"
                                                }>
                                                    {booking.status === "confirmed" ? "Confirmat" :
                                                        booking.status === "cancelled" ? "Anulat" :
                                                            booking.status === "completed" ? "Finalizat" : "În așteptare"}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-sm">

                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{format(new Date(booking.date), "d MMMM yyyy", { locale: ro })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>{booking.time}</span>
                                            </div>
                                            {booking.therapist?.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>{booking.therapist.location}</span>
                                                </div>
                                            )}

                                            <div className="pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full relative"
                                                    onClick={() => setSelectedBookingForChat(booking)}
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Mesaje
                                                    {booking.unreadCount > 0 && (
                                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                            {booking.unreadCount}
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>

                                            {booking.status !== "cancelled" && booking.status !== "completed" && (
                                                <div className="pt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full text-destructive hover:text-destructive"
                                                        onClick={() => {
                                                            if (window.confirm("Ești sigur că vrei să anulezi programarea?")) {
                                                                handleCancel(booking.id);
                                                            }
                                                        }}
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        Anulează Programarea
                                                    </Button>
                                                </div>
                                            )}

                                            {booking.status === "completed" && (
                                                <div className="pt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                                        onClick={() => {
                                                            setSelectedBookingForReview(booking);
                                                            setReviewModalOpen(true);
                                                        }}
                                                    >
                                                        <Star className="h-4 w-4 mr-2" />
                                                        Lasă o Recenzie
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <AccountSettings user={user} />
                </TabsContent>
            </Tabs>

            {selectedBookingForReview && (
                <ReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => {
                        setReviewModalOpen(false);
                        setSelectedBookingForReview(null);
                    }}
                    onSubmit={handleReviewSubmit}
                    therapistName={selectedBookingForReview.therapist?.name}
                    businessName={selectedBookingForReview.business?.company_name}
                />
            )}

            <Dialog open={!!selectedBookingForChat} onOpenChange={(open) => {
                if (!open) {
                    setSelectedBookingForChat(null);
                    window.location.reload();
                }
            }}>
                <DialogContent className="w-[95vw] max-w-[500px] p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="p-4 border-b bg-muted/50">
                        <DialogTitle className="text-base">Chat cu {selectedBookingForChat?.therapist?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedBookingForChat && (
                        <BookingChat
                            bookingId={selectedBookingForChat.id}
                            currentUserId={user.id}
                            otherUserName={selectedBookingForChat.therapist?.name || "Terapeut"}
                            className="border-0 rounded-none h-[500px]"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
