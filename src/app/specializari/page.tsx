import { THERAPIST_SPECIALTIES } from "@/lib/constants";
import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SpecializationsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-3xl mx-auto mb-12 text-center">
                <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-foreground">
                    Caută Terapeut după <span className="text-primary">Specializare</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Alege domeniul care te interesează pentru a găsi expertul potrivit.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {THERAPIST_SPECIALTIES.map((spec) => (
                    <Link
                        key={spec}
                        href={`/terapeuti?specialization=${encodeURIComponent(spec)}`}
                        className="group flex flex-col p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-primary/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Brain className="h-5 w-5" />
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {spec}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Vezi specialiști &rarr;
                        </p>
                    </Link>
                ))}
            </div>

            <div className="mt-16 text-center">
                <Button size="lg" asChild>
                    <Link href="/terapeuti">
                        Vezi Toți Terapeuții
                    </Link>
                </Button>
            </div>
        </div>
    );
}
