import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Heart, HeartHandshake, TrendingUp, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pentru Specialiști | Terapie.md",
    description: "Alătură-te platformei Terapie.md și ajută mai multe persoane să își găsească echilibrul interior. Vizibilitate crescută și comunitate de suport.",
};

export default function SpecialistsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            {/* Hero */}
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
                <h1 className="font-heading text-3xl font-bold md:text-5xl">Pentru Specialiști</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Alătură-te platformei noastre și ajută mai multe persoane să își găsească echilibrul interior.
                </p>
            </div>

            {/* Benefits */}
            <div className="grid gap-8 md:grid-cols-3 mb-20">
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-card border shadow-sm">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Users className="h-8 w-8" />
                    </div>
                    <h3 className="font-heading text-lg font-bold">Vizibilitate Crescută</h3>
                    <p className="text-sm text-muted-foreground">
                        Ajungi la mai mulți clienți potențiali din toată Moldova.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-card border shadow-sm">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <HeartHandshake className="h-8 w-8" />
                    </div>
                    <h3 className="font-heading text-lg font-bold">Comunitate de Suport</h3>
                    <p className="text-sm text-muted-foreground">
                        Fii parte dintr-o rețea de profesioniști dedicați.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-card border shadow-sm">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="font-heading text-lg font-bold">Platformă de Încredere</h3>
                    <p className="text-sm text-muted-foreground">
                        Verificăm și promovăm doar specialiști calificați.
                    </p>
                </div>
            </div>

            {/* How it works */}
            <div className="mb-20">
                <h2 className="font-heading text-2xl font-bold md:text-3xl text-center mb-12">Cum Funcționează</h2>
                <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                            1
                        </div>
                        <h3 className="font-heading text-lg font-bold">Aplică Online</h3>
                        <p className="text-muted-foreground">
                            Completează formularul de aplicare cu informațiile tale profesionale.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                            2
                        </div>
                        <h3 className="font-heading text-lg font-bold">Verif icare</h3>
                        <p className="text-muted-foreground">
                            Echipa noastră verifică acreditările și experiența ta.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                            3
                        </div>
                        <h3 className="font-heading text-lg font-bold">Începe să Ajuți</h3>
                        <p className="text-muted-foreground">
                            Creează-ți profilul și începe să primești solicitări de la clienți.
                        </p>
                    </div>
                </div>
            </div>

            {/* Requirements */}
            <div className="max-w-3xl mx-auto mb-20 rounded-xl bg-muted/50 p-8">
                <h2 className="font-heading text-2xl font-bold mb-6">Cerințe</h2>
                <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Diplomă în Psihologie, Psihoterapie sau domeniu conexe</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Licență sau certificare valabilă în Moldova</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Minimum 2 ani de experiență în practică clinică</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Angajament față de etica profesională și confidențialitate</span>
                    </li>
                </ul>
            </div>

            {/* CTA */}
            <div className="text-center space-y-8">
                <div>
                    <h2 className="font-heading text-3xl font-bold">Gata să începi?</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
                        Alege tipul de cont potrivit pentru tine
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Therapist Registration */}
                    <div className="flex flex-col p-8 rounded-xl bg-card border-2 hover:border-primary transition-colors shadow-sm">
                        <div className="flex-1">
                            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 mx-auto">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-3">Terapeut Individual</h3>
                            <p className="text-muted-foreground mb-6">
                                Ești psiholog, psihoterapeut sau consilier? Creează-ți profilul și începe să ajuți clienți.
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>Profil personal verificat</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>Calendar de programări</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>Vizibilitate în director</span>
                                </li>
                            </ul>
                        </div>
                        <Button size="lg" className="w-full" asChild>
                            <Link href="/aplicare-terapeut">
                                Înregistrare Terapeut
                            </Link>
                        </Button>
                    </div>

                    {/* Business Registration */}
                    <div className="flex flex-col p-8 rounded-xl bg-card border-2 hover:border-primary transition-colors shadow-sm">
                        <div className="flex-1">
                            <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4 mx-auto">
                                <HeartHandshake className="h-8 w-8" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-3">Business Wellness</h3>
                            <p className="text-muted-foreground mb-6">
                                Ai un centru de wellness, spa sau oferă servicii de grup? Promovează-ți ofertele aici.
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                                    <span>Postează oferte și pachete</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                                    <span>Promovare evenimente</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                                    <span>Profil companie verificat</span>
                                </li>
                            </ul>
                        </div>
                        <Button size="lg" variant="secondary" className="w-full" asChild>
                            <Link href="/business/register">
                                Înregistrare Business
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="pt-4">
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/contact">Ai întrebări? Contactează-ne</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
