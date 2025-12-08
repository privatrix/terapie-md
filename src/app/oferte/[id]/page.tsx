"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Share2, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { ReviewModal } from "@/components/features/reviews/ReviewModal";
import { BookingModal } from "@/components/features/bookings/BookingModal";
import { ShareButton } from "@/components/common/ShareButton";

export default function OfferDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const [offer, setOffer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [hasCompletedBooking, setHasCompletedBooking] = useState(false);

    useEffect(() => {
        const fetchOfferAndReviews = async () => {
            const supabase = createClient();

            // Get User
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // Fetch Offer
            const { data: offerData, error } = await supabase
                .from("offers")
                .select(`
                    *,
                    therapist:therapist_profiles(id, name, title, image_url, rating, review_count),
                    business:business_profiles(id, company_name, logo_url, rating, review_count)
                `)
                .eq("id", id)
                .single();

            if (error || !offerData) {
                console.error("Error fetching offer:", error);
                setLoading(false);
                return;
            }

            setOffer(offerData);

            // Fetch Reviews (for the provider)
            let query = supabase.from("reviews").select("*, client:users(email)").order("created_at", { ascending: false });

            if (offerData.business?.id) {
                query = query.eq("business_id", offerData.business.id);
            } else if (offerData.therapist?.id) {
                query = query.eq("therapist_id", offerData.therapist.id);
            }

            const { data: reviewsData } = await query;
            setReviews(reviewsData || []);

            // Check for completed booking if user is logged in
            if (user && offerData) {
                let bookingQuery = supabase
                    .from("bookings")
                    .select("id")
                    .eq("client_id", user.id)
                    .eq("status", "completed");

                if (offerData.therapist?.id) {
                    bookingQuery = bookingQuery.eq("therapist_id", offerData.therapist.id);
                } else if (offerData.business?.id) {
                    bookingQuery = bookingQuery.eq("business_id", offerData.business.id);
                }

                const { data: bookings } = await bookingQuery;
                if (bookings && bookings.length > 0) {
                    setHasCompletedBooking(true);
                }
            }

            setLoading(false);
        };

        if (id) fetchOfferAndReviews();
    }, [id]);

    const handleReviewSubmit = async (rating: number, comment: string) => {
        try {
            const response = await fetch("/api/reviews/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId: offer.business?.id,
                    therapistId: offer.therapist?.id,
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
            // Refresh page to show new review
            window.location.reload();
        } catch (error: any) {
            console.error("Error submitting review:", error);
            alert(`Eroare: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!offer) {
        return notFound();
    }

    const providerName = offer.business?.company_name || offer.therapist?.name || "Provider";
    const providerImage = offer.business?.logo_url || offer.therapist?.image_url;
    const rating = offer.business?.rating || offer.therapist?.rating || 0;
    const reviewCount = offer.business?.review_count || offer.therapist?.review_count || 0;

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <Button variant="ghost" asChild className="mb-8">
                <Link href="/oferte">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Înapoi la Oferte
                </Link>
            </Button>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 justify-between items-start">
                            <div className="flex flex-wrap gap-2">
                                {offer.tags?.map((tag: string) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <ShareButton title={offer.title} />
                        </div>
                        <h1 className="font-heading text-3xl font-bold md:text-4xl">
                            {offer.title}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{offer.location}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4" />
                            <span>{offer.duration}</span>
                        </div>
                    </div>

                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
                        {offer.image_url ? (
                            <img
                                src={offer.image_url}
                                alt={offer.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                Fără imagine
                            </div>
                        )}
                    </div>

                    <div className="prose max-w-none">
                        <h3 className="text-xl font-bold mb-4">Descriere</h3>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                            {offer.description}
                        </p>
                        {offer.long_description && (
                            <div className="mt-4 whitespace-pre-wrap text-muted-foreground">
                                {offer.long_description}
                            </div>
                        )}
                    </div>

                    {/* Reviews Section */}
                    <div className="border-t pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Recenzii ({reviewCount})</h3>
                            {user && hasCompletedBooking && (
                                <Button onClick={() => setReviewModalOpen(true)}>
                                    Lasă o Recenzie
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <p className="text-muted-foreground">Fii primul care lasă o recenzie!</p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review.id} className="border-b pb-4 last:border-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">{review.client?.email?.split('@')[0] || "Client"}</span>
                                            <div className="flex items-center">
                                                <span className="font-bold mr-1">{review.rating}</span>
                                                <span className="text-yellow-500">★</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 sticky top-24">
                    <div className="rounded-xl border border-primary/10 bg-card p-8 shadow-lg">
                        <div className="mb-8">
                            <div className="text-sm font-medium text-muted-foreground mb-2">Preț per ședință</div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-primary">{offer.price} MDL</span>
                                {offer.original_price && (
                                    <span className="text-xl text-muted-foreground line-through decoration-red-500/50">
                                        {offer.original_price} MDL
                                    </span>
                                )}
                            </div>
                            {offer.duration && (
                                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {offer.duration} minute
                                </div>
                            )}
                        </div>

                        <BookingModal
                            offerId={offer.id}
                            businessId={offer.business?.id}
                            therapistId={offer.therapist?.id}
                            providerName={providerName}
                            offerTitle={offer.title}
                            priceRange={offer.price + " MDL"}
                            className="w-full text-lg py-6 shadow-md hover:shadow-lg transition-all"
                        />

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <span>Confirmare rapidă de la furnizor</span>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="font-semibold mb-4">Despre Furnizor</h3>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                                {providerImage ? (
                                    <img src={providerImage} alt={providerName} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold">
                                        {providerName[0]}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="font-medium">{providerName}</div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <span className="font-bold text-foreground mr-1">{rating}</span>
                                    <span className="text-yellow-500 mr-1">★</span>
                                    <span>({reviewCount} recenzii)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                businessName={offer.business?.company_name}
                therapistName={offer.therapist?.name}
            />
        </div>
    );
}
