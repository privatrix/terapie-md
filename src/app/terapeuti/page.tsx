"use client";

import { TherapistCard } from "@/components/features/therapists/TherapistCard";
import { TherapistFilters } from "@/components/features/therapists/TherapistFilters";
import { useState, useMemo, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function TherapistsPage() {
    const [therapists, setTherapists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"rating" | "price" | "reviews">("rating");
    const [locationFilter, setLocationFilter] = useState<string>("");

    useEffect(() => {
        fetchTherapists();
    }, []);

    const fetchTherapists = async () => {
        const supabase = createClient();

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            // Fallback to mock data if no Supabase URL
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from("therapist_profiles")
                .select("*");

            if (error) throw error;

            // Map database fields to component props
            const mappedTherapists = data.map(t => ({
                id: t.id,
                name: t.name || "Terapeut",
                title: t.title || "Specialist",
                specialties: t.specialties || [],
                location: t.location || "Online",
                rating: t.rating || 0,
                reviewCount: t.review_count || 0,
                priceRange: t.price_range || "Nespecificat",
                imageUrl: t.photo_url, // Use photo_url from DB
                photo_url: t.photo_url
            }));

            // Ghost Town Fix: Add placeholders if we have few therapists
            const placeholdersNeeded = Math.max(0, 3 - mappedTherapists.length);
            for (let i = 0; i < placeholdersNeeded; i++) {
                mappedTherapists.push({
                    id: `placeholder-${i}`,
                    name: "Specialist Nou",
                    title: "Coming Soon",
                    specialties: ["Terapie", "Consiliere"],
                    location: "Chișinău",
                    rating: 0,
                    reviewCount: 0,
                    priceRange: "---",
                    imageUrl: null,
                    photo_url: null
                });
            }

            setTherapists(mappedTherapists);
        } catch (error) {
            console.error("Error fetching therapists:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAndSortedTherapists = useMemo(() => {
        let result = [...therapists];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (t) =>
                    t.name?.toLowerCase().includes(query) ||
                    t.title?.toLowerCase().includes(query) ||
                    t.specialties?.some((s: string) => s.toLowerCase().includes(query))
            );
        }

        // Location filter
        if (locationFilter) {
            if (locationFilter === "online") {
                result = result.filter((t) => t.location?.toLowerCase() === "online");
            } else if (locationFilter === "chisinau") {
                result = result.filter((t) => t.location?.toLowerCase().includes("chișinău"));
            } else if (locationFilter === "other") {
                result = result.filter(
                    (t) => !t.location?.toLowerCase().includes("chișinău") && t.location?.toLowerCase() !== "online"
                );
            }
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "rating") {
                return (b.rating || 0) - (a.rating || 0);
            } else if (sortBy === "reviews") {
                return (b.reviewCount || 0) - (a.reviewCount || 0);
            } else if (sortBy === "price") {
                // Extract first number from price range
                const getPrice = (range: string) => parseInt(range?.match(/\d+/)?.[0] || "0");
                return getPrice(a.priceRange) - getPrice(b.priceRange);
            }
            return 0;
        });

        return result;
    }, [therapists, searchQuery, sortBy, locationFilter]);

    const [visibleCount, setVisibleCount] = useState(12);
    const LOAD_STEP = 12;

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + LOAD_STEP);
    };

    const visibleTherapists = filteredAndSortedTherapists.slice(0, visibleCount);
    const hasMore = visibleCount < filteredAndSortedTherapists.length;

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="mb-8 space-y-4">
                <h1 className="font-heading text-3xl font-bold md:text-4xl">
                    Găsește Terapeutul Potrivit
                </h1>
                <p className="max-w-2xl text-muted-foreground">
                    Explorează lista noastră de specialiști verificați și filtrează în funcție de nevoile tale.
                </p>
            </div>

            <div className="mb-8">
                <TherapistFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    locationFilter={locationFilter}
                    onLocationChange={setLocationFilter}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-muted-foreground">
                        {filteredAndSortedTherapists.length} {filteredAndSortedTherapists.length === 1 ? "terapeut găsit" : "terapeuți găsiți"}
                    </div>

                    {filteredAndSortedTherapists.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <p className="text-lg font-medium">Niciun terapeut găsit</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Încearcă să modifici criteriile de căutare
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {visibleTherapists.map((therapist) => (
                                    <TherapistCard key={therapist.id} therapist={therapist} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={handleLoadMore}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-8 py-2"
                                    >
                                        Încarcă mai mulți
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
