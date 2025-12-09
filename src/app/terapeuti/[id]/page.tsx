"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Star,
    Clock,
    Languages,
    GraduationCap,
    CheckCircle,
    Calendar,
    Loader2,
    User
} from "lucide-react";
import Link from "next/link";
import { BookingModal } from "@/components/features/bookings/BookingModal";
import { ShareButton } from "@/components/common/ShareButton";
import { Skeleton } from "@/components/ui/skeleton";

export default function TherapistProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [therapist, setTherapist] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetchTherapist();
        checkAuth();
    }, [params.id]);

    const checkAuth = async () => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
    };

    const fetchTherapist = async () => {
        const supabase = createClient();

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            // Mock data for demo
            setTherapist({
                id: params.id,
                name: "Dr. Elena Popescu",
                title: "Psihoterapeut Integrativ",
                bio: "Cu peste 10 ani de experiență în psihoterapie, mă specializez în ajutarea persoanelor care se confruntă cu anxietate, depresie și probleme de relaționare. Abordarea mea integrativă combină terapia cognitiv-comportamentală cu tehnici de mindfulness și terapie centrată pe client.",
                specialties: ["Anxietate", "Depresie", "Relații", "Burnout"],
                location: "Chișinău, Centru",
                rating: 4.9,
                reviewCount: 124,
                priceRange: "500 - 700 MDL",
                experience_years: 10,
                languages: ["Română", "Rusă", "Engleză"],
                education: ["Universitatea de Stat din Moldova - Psihologie Clinică", "Certificat în Terapie Cognitiv-Comportamentală"],
                availability: "Luni - Vineri: 10:00 - 18:00",
                verified: true,
                imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop"
            });
            setReviews([
                { id: 1, client_name: "Maria I.", rating: 5, comment: "O experiență excelentă. Recomand cu încredere!", created_at: "2024-03-15" },
                { id: 2, client_name: "Andrei P.", rating: 5, comment: "M-a ajutat foarte mult să trec peste o perioadă dificilă.", created_at: "2024-02-28" }
            ]);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("therapist_profiles")
            .select(`
                *,
                reviews (
                    *,
                    client:users!client_id(name, email)
                )
            `)
            .eq("id", params.id)
            .single();

        if (error) {
            console.error("Error fetching therapist:", error);
            setLoading(false);
            return;
        }

        // Calculate average rating
        const fetchedReviews = data.reviews || [];
        const totalRating = fetchedReviews.reduce((acc: number, review: any) => acc + review.rating, 0);
        const averageRating = fetchedReviews.length > 0 ? (totalRating / fetchedReviews.length).toFixed(1) : "Nou";

        setTherapist({ ...data, rating: averageRating, reviewCount: fetchedReviews.length });
        setReviews(fetchedReviews);
        setLoading(false);
    };

    const handleBookAppointment = () => {
        if (!isAuthenticated) {
            router.push("/auth/login?redirect=/terapeuti/" + params.id);
            return;
        }
        // TODO: Open booking modal or navigate to booking page
        alert("Funcționalitatea de programare va fi disponibilă în curând!");
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <Skeleton className="w-full md:w-48 h-64 rounded-xl" />
                            <div className="flex-1 space-y-4">
                                <div>
                                    <Skeleton className="h-8 w-3/4 mb-2" />
                                    <Skeleton className="h-6 w-1/2" />
                                </div>
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-48" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-40 w-full rounded-xl" />
                    </div>
                    <div className="lg:col-span-1">
                        <div className="space-y-4">
                            <Skeleton className="h-64 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!therapist) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Terapeut negăsit</h1>
                <Button asChild>
                    <Link href="/terapeuti">Înapoi la listă</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Profile Image */}
                        <div className="w-full md:w-48 h-64 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                            {therapist.photo_url || therapist.imageUrl ? (
                                <img
                                    src={therapist.photo_url || therapist.imageUrl}
                                    alt={therapist.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                                    <User className="h-20 w-20 opacity-50" />
                                </div>
                            )}
                        </div>

                        {/* Name and Basic Info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <h1 className="font-heading text-3xl font-bold">{therapist.name}</h1>
                                        {therapist.verified && (
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                        )}
                                    </div>
                                    <ShareButton title={therapist.name} />
                                </div>
                                <p className="text-xl text-primary font-medium">{therapist.title}</p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-lg">{therapist.rating}</span>
                                </div>
                                <span className="text-muted-foreground">
                                    ({therapist.reviewCount} recenzii)
                                </span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-5 w-5" />
                                <span>{therapist.location}</span>
                            </div>

                            {/* Specialties */}
                            <div className="flex flex-wrap gap-2">
                                {therapist.specialties?.map((specialty: string) => (
                                    <Badge key={specialty} variant="secondary">
                                        {specialty}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Despre</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {therapist.bio}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Qualifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Calificări și Experiență</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Experience */}
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Experiență</h3>
                                    <p className="text-muted-foreground">{therapist.experience_years} ani în psihoterapie</p>
                                </div>
                            </div>

                            {/* Education */}
                            {therapist.education && therapist.education.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <h3 className="font-medium mb-2">Educație</h3>
                                        <ul className="space-y-1">
                                            {therapist.education.map((edu: any, index: number) => (
                                                <li key={index} className="text-muted-foreground text-sm">
                                                    {typeof edu === 'string' ? (
                                                        <>• {edu}</>
                                                    ) : (
                                                        <>• {edu.degree} {edu.institution ? `- ${edu.institution}` : ''} {edu.year ? `(${edu.year})` : ''}</>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Languages */}
                            {therapist.languages && therapist.languages.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <Languages className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <h3 className="font-medium">Limbi vorbite</h3>
                                        <p className="text-muted-foreground">
                                            {therapist.languages.join(", ")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Reviews Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recenzii ({therapist.reviewCount})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {reviews.length === 0 ? (
                                <p className="text-muted-foreground">Acest terapeut nu are încă recenzii.</p>
                            ) : (
                                reviews.map((review: any) => (
                                    <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium">{review.client?.name || "Client"}</div>
                                                    <div className="flex">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < review.rating
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(review.created_at).toLocaleDateString("ro-RO")}
                                                </span>
                                            </div>
                                            {review.comment && (
                                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Booking Card */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Programează o Consultație</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Price */}
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Preț pe ședință</p>
                                <p className="text-2xl font-bold">{therapist.price_range || therapist.priceRange} MDL</p>
                            </div>

                            {/* Availability */}
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Disponibilitate</p>
                                <p className="text-sm">{therapist.availability}</p>
                            </div>

                            {/* Book Button */}
                            {user?.id === therapist.user_id ? (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                                    <p className="font-medium flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Acesta este profilul tău
                                    </p>
                                    <p className="mt-1">Nu te poți programa la propriile ședințe.</p>
                                </div>
                            ) : (
                                <BookingModal
                                    therapistId={therapist.id}
                                    therapistName={therapist.name}
                                    priceRange={therapist.price_range || therapist.priceRange || "Nespecificat"}
                                />
                            )}

                            <p className="text-xs text-muted-foreground text-center">
                                Vei putea alege data și ora convenabilă pentru tine
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
