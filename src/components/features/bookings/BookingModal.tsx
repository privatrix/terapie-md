"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingModalProps {
    therapistId?: string;
    businessId?: string;
    offerId?: string;
    therapistName?: string;
    providerName?: string;
    priceRange?: string;
    offerTitle?: string;
    className?: string;
}

export function BookingModal({
    therapistId,
    businessId,
    offerId,
    therapistName,
    providerName,
    priceRange,
    offerTitle,
    className
}: BookingModalProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string>("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const displayName = providerName || therapistName || "Provider";
    const displayTitle = offerTitle ? `Rezervă: ${offerTitle}` : "Programează o ședință";

    // Time slots (mock data for now)
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    // Check user session on open
    useEffect(() => {
        const checkSession = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        if (open) checkSession();
    }, [open]);

    // Fetch real-time slots when date changes
    useEffect(() => {
        const fetchSlots = async () => {
            if (!date) {
                setAvailableSlots([]);
                return;
            }

            setLoading(true);
            try {
                const formattedDate = format(date, "yyyy-MM-dd");

                let url = `/api/bookings/availability?date=${formattedDate}`;
                if (offerId) {
                    url += `&offerId=${offerId}`;
                } else if (therapistId) {
                    url += `&therapistId=${therapistId}`;
                }

                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    setAvailableSlots(data.slots || []);
                }
            } catch (error) {
                console.error("Error fetching slots:", error);
                setAvailableSlots([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [date, therapistId, businessId]);

    const handleBooking = async () => {
        if (!date || !time || !user) return;

        setLoading(true);

        try {
            const response = await fetch("/api/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    therapistId,
                    businessId,
                    offerId,
                    date: format(date, "yyyy-MM-dd"),
                    time,
                    notes: notes || "Programare din platformă"
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Eroare la programare");
            }

            setSuccess(true);
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("A apărut o eroare. Te rugăm să încerci din nou.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="lg" className={cn("w-full", className)}>{offerTitle ? "Rezervă Acum" : "Programează o ședință"}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <CalendarIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold">Programare Trimisă!</h2>
                        <p className="text-muted-foreground">
                            Cererea ta pentru <strong>{displayName}</strong> a fost înregistrată.
                            <br />
                            Vei primi o confirmare pe email în curând.
                        </p>
                        <Button onClick={() => setOpen(false)} className="w-full">
                            Închide
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className={cn("w-full", className)}>{offerTitle ? "Rezervă Acum" : "Programează o ședință"}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
                <div className="p-6 pb-2">
                    <DialogHeader>
                        <DialogTitle>{displayTitle}</DialogTitle>
                        <DialogDescription>
                            Cu {displayName} {priceRange ? `• ${priceRange}` : ""}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {!user ? (
                    <div className="p-6 pt-2 text-center space-y-4">
                        <p className="text-muted-foreground">
                            Trebuie să fii autentificat pentru a face o programare.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Button onClick={() => router.push("/auth/login")} className="w-full">
                                Intră în cont
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/auth/signup")} className="w-full">
                                Creează cont
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
                        {/* Date Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Alege Data</label>
                            <div className="rounded-md border flex justify-center p-2">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    locale={ro}
                                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                            </div>
                        </div>

                        {/* Time Selection */}
                        {date && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Alege Ora</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {loading ? (
                                        Array.from({ length: 8 }).map((_, i) => (
                                            <Skeleton key={i} className="h-8 w-full rounded-md" />
                                        ))
                                    ) : availableSlots.length === 0 ? (
                                        <div className="col-span-4 flex flex-col items-center justify-center py-6 space-y-3 bg-secondary/10 rounded-lg border border-dashed border-secondary/50">
                                            <p className="text-sm font-medium text-center">
                                                Nu găsești un loc potrivit?
                                            </p>
                                            <p className="text-sm font-medium text-center">
                                                Nu găsești un loc potrivit?
                                            </p>
                                            <p className="text-xs text-muted-foreground text-center px-4">
                                                Încearcă să alegi o altă dată din calendar.
                                            </p>
                                        </div>
                                    ) : (
                                        availableSlots.map((t) => (
                                            <Button
                                                key={t}
                                                variant={time === t ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setTime(t)}
                                                className={cn(
                                                    "text-xs",
                                                    time === t && "bg-primary text-primary-foreground"
                                                )}
                                            >
                                                {t}
                                            </Button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notes / Message */}
                        {date && time && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mesaj (opțional)</label>
                                <Textarea
                                    placeholder="Adaugă un mesaj pentru terapeut..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="resize-none"
                                />
                            </div>
                        )}

                        {/* Emergency Text */}
                        <div className="pt-4 text-center">
                            <p className="text-xs text-muted-foreground bg-red-50/50 p-2 rounded-md">
                                Urgență medicală? <a href="tel:112" className="text-red-600 font-bold hover:underline">Sună la 112</a>.
                            </p>
                        </div>
                    </div>
                )}

                {/* Sticky Footer Action */}
                {user && date && time && (
                    <div className="p-4 border-t bg-background mt-auto sticky bottom-0 z-10 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center justify-between text-sm mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{format(date, "d MMM", { locale: ro })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{time}</span>
                            </div>
                        </div>
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleBooking}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Se procesează...
                                </>
                            ) : (
                                "Confirmă Programarea"
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
