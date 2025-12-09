import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export function RecruitmentCard() {
    return (
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 h-full">

            {/* Background Blur Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col items-center text-center space-y-4 relative z-10 pt-4">
                <div className="h-24 w-24 rounded-full bg-background flex items-center justify-center shadow-sm border border-border group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="h-10 w-10 text-primary/60 group-hover:text-primary transition-colors" />
                </div>

                <div className="space-y-2">
                    <h3 className="font-heading text-xl font-bold text-foreground">
                        Alătură-te Echipei
                    </h3>
                    <p className="text-sm text-muted-foreground w-full max-w-[200px] mx-auto leading-relaxed">
                        Ești specialist? Profilul tău poate fi afișat aici.
                    </p>
                </div>
            </div>

            <div className="mt-6 relative z-10">
                <Button className="w-full shadow-md group-hover:shadow-lg transition-all" asChild>
                    <Link href="/aplicare-terapeut">
                        Aplică Acum
                    </Link>
                </Button>
            </div>
        </div>
    );
}
