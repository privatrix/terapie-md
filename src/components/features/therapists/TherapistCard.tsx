import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Star, User } from "lucide-react";

interface TherapistProps {
    id: string;
    name: string;
    title: string;
    specialties: string[];
    location: string;
    rating: number;
    reviewCount: number;
    imageUrl?: string;
    photo_url?: string;
    priceRange: string;
}

export function TherapistCard({ therapist }: { therapist: TherapistProps }) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative">
                {therapist.photo_url || therapist.imageUrl ? (
                    <img
                        src={therapist.photo_url || therapist.imageUrl}
                        alt={therapist.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <User className="h-12 w-12 opacity-50" />
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-heading text-lg font-bold group-hover:text-primary transition-colors">
                            {therapist.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{therapist.title}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-secondary/20 px-2 py-1 text-xs font-medium text-secondary-foreground">
                        <Star className="h-3 w-3 fill-current" />
                        {therapist.reviewCount > 0 ? (
                            <>
                                <span>{therapist.rating}</span>
                                <span className="text-muted-foreground">({therapist.reviewCount})</span>
                            </>
                        ) : (
                            <span>Nou</span>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {therapist.specialties.slice(0, 3).map((specialty) => (
                        <span
                            key={specialty}
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary/10 text-secondary-foreground hover:bg-secondary/20"
                        >
                            {specialty}
                        </span>
                    ))}
                    {therapist.specialties.length > 3 && (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-muted text-muted-foreground">
                            +{therapist.specialties.length - 3}
                        </span>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{therapist.location}</span>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between gap-4">
                    <div className="text-sm font-medium">
                        {therapist.priceRange} <span className="text-muted-foreground">/ ședință</span>
                    </div>
                    <Button asChild size="sm">
                        <Link href={`/terapeuti/${therapist.id}`}>Vezi Profil</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
