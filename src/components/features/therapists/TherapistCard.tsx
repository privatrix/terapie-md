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
    const isPlaceholder = therapist.id.startsWith("placeholder");

    return (
        <Link href={isPlaceholder ? "#" : `/terapeuti/${therapist.id}`} className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all pb-4 ${isPlaceholder ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}`}>
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative">
                {therapist.photo_url || therapist.imageUrl ? (
                    <img
                        src={therapist.photo_url || therapist.imageUrl}
                        alt={therapist.name}
                        className={`h-full w-full object-cover transition-transform duration-300 ${isPlaceholder ? 'grayscale' : 'group-hover:scale-105'}`}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <User className={`h-12 w-12 opacity-50 ${isPlaceholder ? 'grayscale' : ''}`} />
                    </div>
                )}
                {isPlaceholder && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                        <span className="bg-background/80 text-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                            În curând
                        </span>
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
                    {!isPlaceholder && (
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
                    )}
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

                <div className="mt-auto pt-6 flex flex-col gap-3">
                    <div className="text-sm font-medium">
                        {therapist.priceRange} <span className="text-muted-foreground">/ ședință</span>
                    </div>
                    <Button
                        asChild={!isPlaceholder}
                        className={`w-full text-base font-semibold shadow-sm transition-all ${!isPlaceholder ? 'hover:shadow-md' : 'opacity-70 cursor-not-allowed'}`}
                        size="lg"
                        disabled={isPlaceholder}
                    >
                        {isPlaceholder ? (
                            <span>Curând</span>
                        ) : (
                            <span className="pointer-events-none">Vezi Profil</span>
                        )}
                    </Button>
                </div>
            </div>
        </Link>
    );
}
