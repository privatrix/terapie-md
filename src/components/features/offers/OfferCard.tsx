import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";

interface OfferProps {
    id: string;
    title: string;
    provider: string;
    description: string;
    price: string;
    originalPrice?: string;
    location: string;
    duration: string;
    image?: string;
    tags: string[];
    rating?: number;
    reviewCount?: number;
    providerImage?: string;
}

export function OfferCard({ offer }: { offer: OfferProps }) {
    return (
        <Link
            href={`/oferte/${offer.id}`}
            className="group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-100 bg-card shadow-sm transition-all duration-300 hover:shadow-xl cursor-pointer"
        >
            <div className="aspect-video w-full overflow-hidden bg-muted relative">
                {offer.image ? (
                    <img
                        src={offer.image}
                        alt={offer.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        Foto Ofertă
                    </div>
                )}
                {offer.originalPrice && (
                    <div className="absolute top-2 right-2 rounded-full bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground z-10">
                        Promo
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-8">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        {offer.providerImage && (
                            <div className="h-6 w-6 rounded-full overflow-hidden border bg-muted">
                                <img src={offer.providerImage} alt={offer.provider} className="h-full w-full object-cover" />
                            </div>
                        )}
                        <span className="font-medium text-primary">{offer.provider}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-foreground">{offer.rating || 0}</span>
                        <span className="text-yellow-500">★</span>
                        <span>({offer.reviewCount || 0} {offer.reviewCount === 1 ? 'recenzie' : 'recenzii'})</span>
                    </div>
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold group-hover:text-primary transition-colors">
                    {offer.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {offer.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                    {offer.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary/10 text-secondary-foreground"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto space-y-4 pt-4 border-t">
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{offer.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{offer.location}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold">{offer.price}</span>
                            {offer.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                    {offer.originalPrice}
                                </span>
                            )}
                        </div>
                        <Button className="w-full h-11 text-base shadow-sm group-hover:shadow-md transition-all">
                            <span className="pointer-events-none">Vezi Oferta</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
