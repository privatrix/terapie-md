import { OfferForm } from "@/components/features/offers/OfferForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Adaugă Ofertă Nouă | Terapie.md",
    description: "Postează o nouă ofertă de wellness pentru clienții tăi.",
};

export default function NewOfferPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <OfferForm />
        </div>
    );
}
