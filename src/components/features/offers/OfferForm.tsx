"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CITIES } from "@/lib/constants";

const offerSchema = z.object({
    title: z.string().min(5, "Titlul trebuie să aibă cel puțin 5 caractere"),
    description: z.string().min(20, "Descrierea trebuie să aibă cel puțin 20 de caractere"),
    price: z.string().min(1, "Prețul este obligatoriu"),
    location: z.string().min(3, "Locația este obligatorie"),
    duration: z.string().min(1, "Durata este obligatorie"),
    tags: z.string().min(3, "Adăugați cel puțin un tag (separate prin virgulă)"),
});

type OfferFormValues = z.infer<typeof offerSchema>;

export function OfferForm({ initialData, offerId }: { initialData?: any, offerId?: string }) {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router = useRouter();

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OfferFormValues>({
        resolver: zodResolver(offerSchema),
        defaultValues: initialData ? {
            title: initialData.title,
            description: initialData.description,
            price: initialData.price.toString(),
            location: initialData.location,
            duration: initialData.duration,
            tags: initialData.tags.join(", "),
        } : undefined,
    });

    const currentLocation = watch("location");

    const [availability, setAvailability] = useState<Record<string, string[]>>(
        initialData?.availability || {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
        }
    );

    const days = [
        { id: "monday", label: "Luni" },
        { id: "tuesday", label: "Marți" },
        { id: "wednesday", label: "Miercuri" },
        { id: "thursday", label: "Joi" },
        { id: "friday", label: "Vineri" },
        { id: "saturday", label: "Sâmbătă" },
        { id: "sunday", label: "Duminică" }
    ];

    const addSlot = (day: string) => {
        const slots = availability[day] || [];
        let newSlot = "09:00";

        if (slots.length > 0) {
            const lastSlot = slots[slots.length - 1];
            const [hours, minutes] = lastSlot.split(':').map(Number);
            if (!isNaN(hours)) {
                let nextHour = hours + 1;
                if (nextHour > 23) nextHour = 0;
                newSlot = `${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
        }

        setAvailability({
            ...availability,
            [day]: [...slots, newSlot]
        });
    };

    const addBulkSlots = (day: string) => {
        // Standard 9-17
        const newSlots = [
            "09:00", "10:00", "11:00", "12:00",
            "13:00", "14:00", "15:00", "16:00", "17:00"
        ];
        setAvailability({
            ...availability,
            [day]: newSlots
        });
    };

    const copyFromMonday = (day: string) => {
        setAvailability({
            ...availability,
            [day]: [...(availability["monday"] || [])]
        });
    };

    const removeSlot = (day: string, index: number) => {
        const slots = [...availability[day]];
        slots.splice(index, 1);
        setAvailability({
            ...availability,
            [day]: slots
        });
    };

    const updateSlot = (day: string, index: number, value: string) => {
        const slots = [...availability[day]];
        slots[index] = value;
        setAvailability({
            ...availability,
            [day]: slots
        });
    };

    const onSubmit = async (data: OfferFormValues) => {
        setLoading(true);
        const supabase = createClient();

        try {
            // 1. Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Nu sunteți autentificat");

            // 2. Upload Image (if any)
            let imageUrl = initialData?.image_url || null;
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('offers')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('offers')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            // 3. Prepare Data
            const offerData: any = {
                title: data.title,
                description: data.description,
                price: parseFloat(data.price),
                location: data.location,
                duration: data.duration,
                tags: data.tags.split(",").map(t => t.trim()),
                image_url: imageUrl,
                active: true,
                availability: availability // Add availability to payload
            };

            if (offerId) {
                // UPDATE
                const { error } = await supabase
                    .from("offers")
                    .update(offerData)
                    .eq("id", offerId);

                if (error) throw error;
                alert("Ofertă actualizată cu succes!");
            } else {
                // INSERT
                // Get profile (therapist or business)
                let profileId = null;
                let isBusiness = false;

                const { data: therapistProfile } = await supabase
                    .from("therapist_profiles")
                    .select("id")
                    .eq("user_id", user.id)
                    .single();

                if (therapistProfile) {
                    profileId = therapistProfile.id;
                } else {
                    // Check for business profile
                    const { data: businessProfile } = await supabase
                        .from("business_profiles")
                        .select("id")
                        .eq("user_id", user.id)
                        .single();

                    if (businessProfile) {
                        profileId = businessProfile.id;
                        isBusiness = true;
                    }
                }

                if (!profileId) throw new Error("Nu aveți profil de terapeut sau business");

                if (isBusiness) {
                    offerData.business_id = profileId;
                } else {
                    offerData.provider_id = profileId;
                }

                const { error } = await supabase.from("offers").insert(offerData);
                if (error) throw error;
                alert("Ofertă adăugată cu succes!");
            }

            router.push("/dashboard");
            router.refresh();

        } catch (error: any) {
            console.error("Error submitting offer:", error);
            alert(`Eroare: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 bg-card rounded-xl border shadow-sm">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">{offerId ? "Editează Oferta" : "Adaugă o Ofertă Nouă"}</h2>
                <p className="text-muted-foreground">
                    {offerId ? "Modifică detaliile ofertei existente." : "Completează detaliile ofertei tale de wellness."}
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Titlu Ofertă</Label>
                    <Input id="title" {...register("title")} placeholder="ex: Workshop Gestionarea Stresului" />
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Descriere</Label>
                    <Textarea id="description" {...register("description")} placeholder="Descrieți oferta în detaliu..." className="min-h-[100px]" />
                    {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Preț (MDL)</Label>
                        <Input id="price" type="number" {...register("price")} placeholder="ex: 500" />
                        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="duration">Durată</Label>
                        <Input id="duration" {...register("duration")} placeholder="ex: 90 minute" />
                        {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Locație</Label>
                    <Select
                        value={currentLocation}
                        onValueChange={(value) => setValue("location", value, { shouldValidate: true })}
                    >
                        <SelectTrigger id="location">
                            <SelectValue placeholder="Selectează locația" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* NOTE: CITIES must be imported */}
                            {CITIES.map((city) => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">Etichete (separate prin virgulă)</Label>
                    <Input id="tags" {...register("tags")} placeholder="ex: Relaxare, Masaj, Mindfulness" />
                    {errors.tags && <p className="text-sm text-red-500">{errors.tags.message}</p>}
                </div>

                {/* Availability Section */}
                <div className="space-y-4 border rounded-lg p-4">
                    <Label className="text-lg font-semibold">Disponibilitate</Label>
                    <p className="text-sm text-muted-foreground mb-4">Selectați intervalele orare disponibile pentru fiecare zi.</p>

                    {days.map((day) => (
                        <div key={day.id} className="space-y-2 border-b pb-4 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <Label className="font-medium w-24">{day.label}</Label>
                                <div className="flex gap-2">
                                    {day.id !== "monday" && (
                                        <Button type="button" variant="ghost" size="sm" onClick={() => copyFromMonday(day.id)} title="Copiază de Luni">
                                            Copiază Luni
                                        </Button>
                                    )}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Selectează Ore
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Selectează ore pentru {day.label}</DialogTitle>
                                                <DialogDescription>
                                                    Alegeți intervalele orare disponibile.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid grid-cols-4 gap-2 py-4">
                                                {Array.from({ length: 15 }, (_, i) => i + 7).map((hour) => {
                                                    const time = `${hour.toString().padStart(2, '0')}:00`;
                                                    const isSelected = availability[day.id]?.includes(time);
                                                    return (
                                                        <Button
                                                            key={time}
                                                            type="button"
                                                            variant={isSelected ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => {
                                                                const currentSlots = availability[day.id] || [];
                                                                let newSlots;
                                                                if (isSelected) {
                                                                    newSlots = currentSlots.filter(s => s !== time);
                                                                } else {
                                                                    newSlots = [...currentSlots, time].sort();
                                                                }
                                                                setAvailability({
                                                                    ...availability,
                                                                    [day.id]: newSlots
                                                                });
                                                            }}
                                                        >
                                                            {time}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[32px]">
                                {availability[day.id]?.length === 0 && (
                                    <span className="text-sm text-muted-foreground italic self-center">Indisponibil</span>
                                )}
                                {availability[day.id]?.map((slot, index) => (
                                    <div key={index} className="flex items-center gap-1 bg-secondary rounded-md px-2 py-1 text-sm">
                                        <span>{slot}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSlot(day.id, index)}
                                            className="text-muted-foreground hover:text-destructive ml-1"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <Label>Imagine (Opțional)</Label>
                    <div className="flex items-center gap-4">
                        <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                            <Upload className="h-4 w-4 mr-2" />
                            {initialData?.image_url || imageFile ? "Schimbă Imaginea" : "Încarcă Imagine"}
                        </Button>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                        {(imageFile || initialData?.image_url) && (
                            <div className="flex items-center gap-2 text-sm bg-muted px-3 py-1 rounded-full">
                                {imageFile ? imageFile.name : "Imagine existentă"}
                                {imageFile && (
                                    <button type="button" onClick={() => setImageFile(null)} className="text-muted-foreground hover:text-foreground">
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {initialData?.image_url && !imageFile && (
                        <div className="mt-2 w-32 h-20 rounded-md overflow-hidden border">
                            <img src={initialData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div >

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {offerId ? "Se actualizează..." : "Se postează..."}
                    </>
                ) : (
                    offerId ? "Salvează Modificările" : "Postează Oferta"
                )}
            </Button>
        </form >
    );
}
