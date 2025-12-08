"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft, CheckCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data (duplicated from main offers page for now)
const offers = [
    {
        id: "1",
        title: "Pachet Relaxare Totală",
        provider: "Centrul de Wellness Lotus",
        description: "O sesiune completă de relaxare care include masaj terapeutic, aromaterapie și meditație ghidată.",
        longDescription: `
            Experimentează o stare profundă de relaxare cu pachetul nostru complet "Relaxare Totală". 
            
            Acest pachet include:
            - 60 minute de masaj terapeutic personalizat pentru detensionare musculară.
            - 15 minute de aromaterapie cu uleiuri esențiale organice.
            - 15 minute de meditație ghidată pentru calmarea minții.
            
            Este soluția perfectă pentru a scăpa de stresul acumulat și pentru a-ți recăpăta echilibrul interior. Terapeuții noștri certificați vor avea grijă ca fiecare moment să fie o experiență de neuitat.
        `,
        price: "800 MDL",
        originalPrice: "1000 MDL",
        location: "Chișinău, Botanica",
        duration: "90 minute",
        tags: ["Relaxare", "Masaj", "Meditație"],
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=600&fit=crop",
        features: [
            "Masaj terapeutic",
            "Aromaterapie",
            "Meditație ghidată",
            "Ceai relaxant la final",
            "Acces la zona de relaxare"
        ]
    },
    {
        id: "2",
        title: "Atelier de Gestionare a Stresului",
        provider: "Psiholog Andrei Munteanu",
        description: "Învață tehnici practice de reducere a stresului și anxietății în viața de zi cu zi.",
        longDescription: `
            Stresul este o parte inevitabilă a vieții moderne, dar modul în care reacționăm la el face diferența.
            
            În acest atelier interactiv de 2 ore, vei învăța:
            - Mecanismele fiziologice și psihologice ale stresului.
            - Tehnici de respirație pentru calmare rapidă.
            - Strategii cognitive pentru a schimba perspectiva asupra situațiilor stresante.
            - Cum să îți construiești o rutină zilnică care promovează reziliența.
            
            Atelierul se desfășoară online, într-un grup restrâns, pentru a permite interacțiunea și exercițiile practice.
        `,
        price: "400 MDL",
        location: "Online",
        duration: "2 ore",
        tags: ["Workshop", "Stres", "Online"],
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=600&fit=crop",
        features: [
            "Sesiune interactivă",
            "Materiale suport PDF",
            "Exerciții practice",
            "Q&A la final"
        ]
    },
    {
        id: "3",
        title: "Retreat de Weekend: Reconectare",
        provider: "Asociația Mindful Moldova",
        description: "Un weekend în natură dedicat regăsirii echilibrului interior prin yoga, meditație și drumeții.",
        longDescription: `
            Evadează din agitația orașului și reconectează-te cu tine și cu natura în acest retreat de weekend la Orheiul Vechi.
            
            Programul include:
            - Sesiuni de yoga la răsărit și apus.
            - Meditații ghidate în natură.
            - Drumeții ușoare pe traseele pitorești din zonă.
            - Mese vegetariene sănătoase și delicioase.
            - Cercuri de discuții și timp liber pentru reflecție.
            
            Cazarea se face în pensiuni tradiționale, oferind o experiență autentică și confortabilă.
        `,
        price: "2500 MDL",
        originalPrice: "3000 MDL",
        location: "Orheiul Vechi",
        duration: "2 zile",
        tags: ["Retreat", "Natură", "Yoga"],
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop",
        features: [
            "Cazare 1 noapte",
            "Toate mesele incluse",
            "4 sesiuni de yoga/meditație",
            "Ghidaj profesionist",
            "Transport din Chișinău (opțional)"
        ]
    },
    {
        id: "4",
        title: "Consultatie Nutriție & Wellness",
        provider: "Dr. Maria Ionescu",
        description: "Evaluare completă a stilului de viață și plan personalizat de nutriție pentru sănătate mintală.",
        longDescription: `
            Sănătatea mintală și cea fizică sunt strâns legate. O alimentație echilibrată poate avea un impact major asupra stării tale de spirit și a nivelului de energie.
            
            În cadrul acestei consultații, vom analiza:
            - Obiceiurile tale alimentare actuale.
            - Nivelul de activitate fizică și somnul.
            - Obiectivele tale de sănătate.
            
            Vei primi un plan nutrițional personalizat, ușor de urmat, și recomandări de suplimente (dacă este cazul) pentru a-ți susține bunăstarea generală.
        `,
        price: "600 MDL",
        location: "Chișinău, Centru",
        duration: "60 minute",
        tags: ["Nutriție", "Sănătate"],
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=600&fit=crop",
        features: [
            "Evaluare inițială detaliată",
            "Plan alimentar personalizat",
            "Recomandări stil de viață",
            "Follow-up pe email timp de 1 săptămână"
        ]
    },
];

export default async function OfferDetailsPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    // slug is an array of strings. We only care about the first one for now.
    const offerId = slug[0];
    const offer = offers.find((o) => o.id === offerId);

    if (!offer) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Hero Section */}
            <div className="relative h-[40vh] w-full overflow-hidden bg-muted">
                <img
                    src={offer.image}
                    alt={offer.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white container mx-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {offer.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 font-heading">{offer.title}</h1>
                    <p className="text-lg md:text-xl text-white/90 font-medium">{offer.provider}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-card rounded-xl shadow-sm border p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
                                    <Link href="/oferte">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Înapoi la oferte
                                    </Link>
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <h2 className="text-2xl font-bold mb-4 font-heading">Descriere</h2>
                                <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                                    {offer.longDescription || offer.description}
                                </div>
                            </div>

                            {offer.features && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold mb-4 font-heading">Ce este inclus</h3>
                                    <ul className="grid sm:grid-cols-2 gap-3">
                                        {offer.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-xl shadow-sm border p-6 sticky top-24 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm text-muted-foreground">Preț total</span>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-primary">{offer.price}</div>
                                        {offer.originalPrice && (
                                            <div className="text-sm text-muted-foreground line-through">
                                                {offer.originalPrice}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <span className="font-medium block">Durată</span>
                                            <span className="text-muted-foreground">{offer.duration}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <span className="font-medium block">Locație</span>
                                            <span className="text-muted-foreground">{offer.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <span className="font-medium block">Disponibilitate</span>
                                            <span className="text-muted-foreground">La cerere / Programare</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <Button className="w-full h-12 text-lg font-semibold">
                                    Rezervă Acum
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Contactează Furnizorul
                                </Button>
                            </div>

                            <p className="text-xs text-center text-muted-foreground">
                                Rezervarea este confirmată doar după contactarea furnizorului.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
