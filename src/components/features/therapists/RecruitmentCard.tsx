import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function TherapistRecruitmentCard() {
    return (
        <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="p-8 flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                        <UserPlus className="h-7 w-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider border border-green-100">
                        Hiring
                    </span>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                    <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        Ești Specialist?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Extinde-ți practica și conectează-te cu clienți care au nevoie de tine.
                    </p>
                </div>

                {/* Benefits / Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {["Program Flexibil", "Remote", "Vizibilitate"].map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-md bg-gray-50 text-xs font-medium text-gray-600 border border-gray-100">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto">
                    <Button className="w-full h-11 text-base shadow-sm group-hover:shadow-md transition-all hover:bg-primary hover:text-white" variant="outline" asChild>
                        <Link href="/aplicare-terapeut" className="flex items-center justify-center gap-2">
                            Aplică Acum
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
        </div>
    );
}

// Backward compatibility (if used elsewhere as RecruitmentCard)
export const RecruitmentCard = TherapistRecruitmentCard;
