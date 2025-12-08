"use client";

import { OfferForm } from "@/components/features/offers/OfferForm";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditOfferPage() {
    const params = useParams();
    const router = useRouter();
    const [offer, setOffer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffer = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("offers")
                .select("*")
                .eq("id", params.id)
                .single();

            if (error) {
                console.error("Error fetching offer:", error);
                alert("Ofertă nu a fost găsită.");
                router.push("/dashboard");
                return;
            }

            setOffer(data);
            setLoading(false);
        };

        if (params.id) {
            fetchOffer();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <OfferForm initialData={offer} offerId={offer.id} />
        </div>
    );
}
