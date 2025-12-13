import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Heart, Shield, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            <div className="relative bg-background border-b overflow-hidden">
                <div className="container mx-auto px-4 py-16 md:py-24 md:px-6">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        {/* Text Content */}
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="space-y-4">
                                <h1 className="font-heading text-4xl font-bold md:text-5xl lg:text-6xl text-slate-900 leading-tight">
                                    Reinventăm echilibrul <span className="text-primary">tău interior.</span>
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Misiunea noastră este să facem terapia accesibilă, să eliminăm stigmatul din jurul sănătății mintale în Moldova și să construim o comunitate mai puternică împreună.
                                </p>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative mx-auto lg:ml-auto w-full max-w-md lg:max-w-full">
                            <div className="aspect-[4/5] md:aspect-square lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative">
                                <img
                                    src="https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=1200&auto=format&fit=crop"
                                    alt="Wellness and Balance"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            {/* Floating Badge (Decorative) */}
                            <div className="absolute -bottom-6 -left-6 md:bottom-8 md:-left-8 bg-white p-4 rounded-2xl shadow-xl hidden md:block animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Heart className="h-5 w-5 fill-current" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Comunitate</p>
                                        <p className="font-bold text-slate-900">100% Verified</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
                {/* Story Section - Card Layout */}
                <div className="grid gap-8 lg:gap-12 md:grid-cols-2 items-center mb-24">
                    <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm md:mr-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                        <CardContent className="p-8 md:p-10 space-y-6">
                            <h2 className="font-heading text-3xl font-bold text-foreground">
                                Povestea Noastră
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Terapie.md a luat naștere din dorința de a crea un spațiu sigur și prietenos unde oamenii pot găsi sprijinul de care au nevoie. Am observat cât de dificil poate fi să găsești un specialist de încredere și am decis să simplificăm acest proces.
                                </p>
                                <p>
                                    Credem că sănătatea mintală este la fel de importantă ca cea fizică și că fiecare persoană merită acces la servicii de calitate, fără judecată.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="relative aspect-square md:aspect-[4/5] bg-muted rounded-2xl overflow-hidden shadow-xl rotate-3 transition-transform hover:rotate-0 duration-500">
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                            alt="Echipa Terapie.md"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold md:text-4xl mb-4">Valorile Noastre</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Principiile care ne ghidează în fiecare zi pentru a oferi cea mai bună experiență.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                            <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
                                <div className="p-4 rounded-full bg-background text-primary shadow-sm">
                                    <Heart className="h-8 w-8" />
                                </div>
                                <h3 className="font-heading text-xl font-bold">Empatie</h3>
                                <p className="text-muted-foreground">
                                    Punem omul pe primul loc și tratăm fiecare situație cu înțelegere și compasiune.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                            <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
                                <div className="p-4 rounded-full bg-background text-primary shadow-sm">
                                    <Shield className="h-8 w-8" />
                                </div>
                                <h3 className="font-heading text-xl font-bold">Siguranță</h3>
                                <p className="text-muted-foreground">
                                    Asigurăm un mediu confidențial și verificăm riguros toți specialiștii de pe platformă.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                            <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
                                <div className="p-4 rounded-full bg-background text-primary shadow-sm">
                                    <Users className="h-8 w-8" />
                                </div>
                                <h3 className="font-heading text-xl font-bold">Comunitate</h3>
                                <p className="text-muted-foreground">
                                    Construim o comunitate de suport unde nimeni nu trebuie să treacă singur prin greutăți.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CTA */}
                <div className="relative overflow-hidden bg-primary rounded-3xl p-12 text-center text-primary-foreground shadow-2xl">
                    <div className="relative z-10 space-y-6">
                        <h2 className="font-heading text-3xl font-bold md:text-4xl">Ești gata să începi?</h2>
                        <p className="text-primary-foreground/90 max-w-xl mx-auto text-lg">
                            Fă primul pas spre o viață mai echilibrată. Găsește terapeutul potrivit pentru tine astăzi.
                        </p>
                        <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold" asChild>
                            <Link href="/terapeuti">Caută Terapeut</Link>
                        </Button>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
                </div>
            </div>
        </>
    );
}
