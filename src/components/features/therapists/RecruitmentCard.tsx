import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function TherapistRecruitmentCard() {
    return (
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/30 bg-white p-6 hover:border-primary/50 hover:bg-white transition-all duration-300 h-full min-h-[380px]">

            {/* Background Blur Effect */}
            <div className="absolute inset-0 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col items-center text-center space-y-4 relative z-10 pt-8 flex-grow justify-center">
                {/* Silhouette / Avatar */}
                <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 group-hover:border-primary/40 group-hover:scale-105 transition-all duration-300">
                    <UserPlus className="h-10 w-10 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </div>

                <div className="space-y-2 mt-4">
                    <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        Ești Specialist?
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                        Alătură-te echipei Terapie.md și ajută oamenii să își găsească echilibrul.
                    </p>
                </div>
            </div>

            <div className="mt-6 relative z-10">
                <Button className="w-full" variant="outline" asChild>
                    <Link href="/aplicare-terapeut">
                        Aplică Acum
                    </Link>
                </Button>
            </div>
        </div>
    );
}

// Backward compatibility (if used elsewhere as RecruitmentCard)
export const RecruitmentCard = TherapistRecruitmentCard;
