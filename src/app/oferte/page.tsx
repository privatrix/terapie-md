"use client";

import { OfferCard } from "@/components/features/offers/OfferCard";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Plus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { RecruitmentOfferCard } from "@/components/features/offers/RecruitmentOfferCard";
import { OfferFilters } from "@/components/features/offers/OfferFilters";

export default function OffersPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "title" | "newest">("newest");
    const [locationFilter, setLocationFilter] = useState<string>("");
    const [isTherapist, setIsTherapist] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);

    useEffect(() => {
        fetchOffers();
        checkUser();
    }, []);

    const checkUser = async () => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
            // Check for therapist profile
            const { data: therapist } = await supabase
                .from("therapist_profiles")
                .select("id")
                .eq("user_id", session.user.id)
                .single();

            if (therapist) {
                setIsTherapist(true);
            }

            // Check for business profile
            const { data: business } = await supabase
                .from("business_profiles")
                .select("id")
                .eq("user_id", session.user.id)
                .single();

            if (business) {
                setIsBusiness(true);
            }
        }
    };

    const fetchOffers = async () => {
        try {
            const supabase = createClient();

            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                // Keep mock data only if no Supabase URL (dev environment without env vars)
                setOffers([
                    {
                        id: "1",
                        title: "Pachet Relaxare Totală",
                        provider: "Centrul de Wellness Lotus",
                        description: "O sesiune completă de relaxare care include masaj terapeutic, aromaterapie și meditație ghidată.",
                        price: "800 MDL",
                        originalPrice: "1000 MDL",
                        location: "Chișinău, Botanica",
                        duration: "90 minute",
                        tags: ["Relaxare", "Masaj", "Meditație"],
                        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
                    }
                ]);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("offers")
                .select(`
                    *,
                    therapist:therapist_profiles(name, rating, review_count, photo_url),
                    business:business_profiles(company_name, rating, review_count, logo_url)
                `)
                .eq("active", true)
                .order("created_at", { ascending: false });

            if (error) throw error;

            const formattedOffers = data.map(offer => ({
                id: offer.id,
                title: offer.title,
                provider: offer.business?.company_name || offer.therapist?.name || "Provider necunoscut",
                description: offer.description,
                price: `${offer.price} MDL`,
                originalPrice: offer.original_price ? `${offer.original_price} MDL` : undefined,
                location: offer.location,
                duration: offer.duration,
                tags: offer.tags || [],
                image: offer.image_url || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
                rating: offer.business?.rating || offer.therapist?.rating || 0,
                reviewCount: offer.business?.review_count || offer.therapist?.review_count || 0,
                providerImage: offer.business?.logo_url || offer.therapist?.photo_url
            }));

            setOffers(formattedOffers);
        } catch (error) {
            console.error("Error fetching offers:", error, JSON.stringify(error, null, 2));
        } finally {
            setLoading(false);
        }
    };

    const filteredAndSortedOffers = useMemo(() => {
        let result = [...offers];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (o) =>
                    o.title.toLowerCase().includes(query) ||
                    o.description.toLowerCase().includes(query) ||
                    o.tags.some((t: string) => t.toLowerCase().includes(query))
            );
        }

        // Location filter
        // Location filter
        if (locationFilter && locationFilter !== "all") {
            result = result.filter((o) =>
                o.location.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "price_asc") {
                const getPrice = (priceStr: string) => parseInt(priceStr.match(/\d+/)?.[0] || "0");
                return getPrice(a.price) - getPrice(b.price);
            } else if (sortBy === "price_desc") {
                const getPrice = (priceStr: string) => parseInt(priceStr.match(/\d+/)?.[0] || "0");
                return getPrice(b.price) - getPrice(a.price);
            } else if (sortBy === "title") {
                return a.title.localeCompare(b.title);
            }
            return 0; // newest is default
        });

        return result;
    }, [offers, searchQuery, sortBy, locationFilter]);

    const [visibleCount, setVisibleCount] = useState(8);
    const LOAD_STEP = 8;

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + LOAD_STEP);
    };

    const visibleOffers = filteredAndSortedOffers.slice(0, visibleCount);
    const hasMore = visibleCount < filteredAndSortedOffers.length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 pt-6 md:pt-8">
            {/* Filters */}
            <div className="mb-8">
                <OfferFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    locationFilter={locationFilter}
                    onLocationChange={setLocationFilter}
                />
            </div>

            <div className="mb-4 text-sm text-muted-foreground">
                {filteredAndSortedOffers.length} {filteredAndSortedOffers.length === 1 ? "ofertă găsită" : "oferte găsite"}
            </div>

            {
                filteredAndSortedOffers.length === 0 ? (
                    <div className="space-y-12">
                        <div className="flex flex-col items-center justify-center py-16 text-center border-b border-dashed">
                            <p className="text-lg font-medium">Nicio ofertă găsită</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Încearcă să modifici criteriile de căutare
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            <RecruitmentOfferCard />
                            <RecruitmentOfferCard />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {visibleOffers.map((offer) => (
                                <OfferCard key={offer.id} offer={offer} />
                            ))}

                            {/* Always append 2 Recruitment Cards for businesses */}
                            <RecruitmentOfferCard />
                            <RecruitmentOfferCard />
                        </div>

                        {hasMore && (
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-8 py-2"
                                >
                                    Încarcă mai multe
                                </button>
                            </div>
                        )}
                    </>
                )
            }
        </div >

    );
}
