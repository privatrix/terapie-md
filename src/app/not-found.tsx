import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="space-y-6">
                <h1 className="font-heading text-9xl font-bold text-primary">404</h1>
                <div className="space-y-2">
                    <h2 className="font-heading text-3xl font-bold">Pagina nu a fost găsită</h2>
                    <p className="text-muted-foreground max-w-md">
                        Ne pare rău, dar pagina pe care o cauți nu există sau a fost mutată.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button asChild size="lg">
                        <Link href="/">Înapoi acasă</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/terapeuti">Caută Terapeut</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
