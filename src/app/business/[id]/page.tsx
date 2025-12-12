"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Mail, Phone, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { OfferCard } from "@/components/features/offers/OfferCard";
// import { Separator } from "@/components/ui/select"; // Removed invalid import

export default function BusinessProfilePage() {
    const params = useParams();
    const id = params?.id as string;
    const [business, setBusiness] = useState<any>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            const supabase = createClient();

            try {
                // 1. Fetch Business Profile
                const { data: businessData, error: businessError } = await supabase
                    .from("business_profiles")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (businessError || !businessData) {
                    console.error("Error fetching business:", businessError);
                    setLoading(false);
                    return;
                }

                setBusiness(businessData);

                // 2. Fetch Offers
                const { data: offersData } = await supabase
                    .from("offers")
                    .select("*, business:business_profiles(company_name, logo_url)")
                    .eq("business_id", id)
                    .eq("active", true)
                    .order("created_at", { ascending: false });

                setOffers(offersData || []);

                // 3. Fetch Reviews
                const { data: reviewsData } = await supabase
                    .from("reviews")
                    .select("*, client:users(email)")
                    .eq("business_id", id)
                    .order("created_at", { ascending: false });

                setReviews(reviewsData || []);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!business) {
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <Button variant="ghost" asChild className="mb-8">
                <Link href="/oferte">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Înapoi la Oferte
                </Link>
            </Button>

            {/* Header Section */}
            <div className="relative mb-8 rounded-3xl bg-white p-8 shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Logo */}
                    <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                        {business.logo_url ? (
                            <img
                                src={business.logo_url}
                                alt={business.company_name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-4xl font-bold text-primary">
                                {business.company_name?.[0]}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">
                                {business.company_name}
                            </h1>
                            {business.verified && (
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none gap-1 px-3 py-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Verificat</span>
                                </Badge>
                            )}
                        </div>

                        {business.location && (
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                {business.location}
                            </div>
                        )}

                        <p className="text-muted-foreground whitespace-pre-wrap max-w-2xl">
                            {business.description || "Nu există descriere disponibilă."}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            {business.website && (
                                <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-medium text-primary hover:underline">
                                    <Globe className="h-4 w-4 mr-2" />
                                    Website
                                </a>
                            )}
                            {business.contact_email && (
                                <a href={`mailto:${business.contact_email}`} className="flex items-center text-sm font-medium text-primary hover:underline">
                                    <Mail className="h-4 w-4 mr-2" />
                                    {business.contact_email}
                                </a>
                            )}
                            {business.contact_phone && (
                                <a href={`tel:${business.contact_phone}`} className="flex items-center text-sm font-medium text-primary hover:underline">
                                    <Phone className="h-4 w-4 mr-2" />
                                    {business.contact_phone}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col gap-4 min-w-[200px] border-l pl-8 border-gray-100">
                        <div>
                            <div className="text-3xl font-bold text-gray-900">{business.rating || "0.0"}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                                <span className="text-yellow-500 mr-1">★</span>
                                {business.review_count || 0} recenzii
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900">{offers.length}</div>
                            <div className="text-sm text-muted-foreground">Oferte Active</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 font-heading">Recenzii ({reviews.length})</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="font-bold text-gray-900">{review.client?.email?.split('@')[0] || "Client"}</div>
                                        <div className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                                        <span className="font-bold text-yellow-700 mr-1">{review.rating}</span>
                                        <span className="text-yellow-500 text-xs">★</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Offers Section */}
            <div>
                <h2 className="text-2xl font-bold mb-6 font-heading">Oferte Disponibile ({offers.length})</h2>
                {offers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                        <p className="text-muted-foreground">Acest business nu are oferte active momentan.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {offers.map((offer) => (
                            <OfferCard
                                key={offer.id}
                                offer={{
                                    id: offer.id,
                                    title: offer.title,
                                    provider: offer.business?.company_name || "Business",
                                    description: offer.description,
                                    price: `${offer.price} MDL`,
                                    originalPrice: offer.original_price ? `${offer.original_price} MDL` : undefined,
                                    location: offer.location,
                                    duration: offer.duration,
                                    tags: offer.tags || [],
                                    image: offer.image_url,
                                    rating: business.rating,
                                    reviewCount: business.review_count,
                                    providerImage: business.logo_url
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
