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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const businessSchema = z.object({
    companyName: z.string().min(3, "Numele companiei este obligatoriu"),
    email: z.string().email("Email invalid"),
    phone: z.string().min(8, "Telefon invalid"),
    description: z.string().optional(),
    website: z.string().optional(),
    location: z.string().min(3, "Locația este obligatorie"),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export default function BusinessRegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<BusinessFormValues>({
        resolver: zodResolver(businessSchema),
    });

    const onSubmit = async (data: BusinessFormValues) => {
        setLoading(true);
        const supabase = createClient();

        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                // Demo mode
                alert("Aplicație trimisă cu succes! (Demo Mode)\\n\\nVeți fi contactat după verificare.");
                router.push("/");
                setLoading(false);
                return;
            }

            // Submit business application for admin review
            const { error } = await supabase
                .from("business_applications")
                .insert({
                    company_name: data.companyName,
                    cui: null, // CUI is now optional/removed
                    contact_email: data.email,
                    contact_phone: data.phone,
                    description: data.description,
                    website: data.website && !data.website.startsWith('http') ? `https://${data.website}` : data.website,
                    location: data.location,
                    status: "pending"
                });

            if (error) throw error;

            alert("Aplicație trimisă cu succes!\\n\\nEchipa noastră va verifica informațiile și vă va contacta în curând.");
            router.push("/");

        } catch (error: any) {
            console.error("Application error:", error);
            alert(`Eroare: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Aplicație Business Wellness</h1>
                <p className="text-muted-foreground">Trimite o aplicație pentru a fi inclus pe platforma noastră.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="companyName">Nume Companie</Label>
                    <Input id="companyName" {...register("companyName")} placeholder="ex: Lotus Spa" />
                    {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Business</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="contact@companie.md" />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" {...register("phone")} placeholder="+373..." />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Adresă Fizică</Label>
                    <Input id="location" {...register("location")} placeholder="Strada..." />
                    {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website">Website (Opțional)</Label>
                    <Input id="website" {...register("website")} placeholder="https://..." />
                    {errors.website && <p className="text-sm text-red-500">{errors.website.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Descriere Scurtă</Label>
                    <Textarea id="description" {...register("description")} placeholder="Despre serviciile oferite..." />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Se trimite aplicația...
                        </>
                    ) : (
                        "Trimite Aplicație"
                    )}
                </Button>
            </form>
        </div>
    );
}
