import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Shield, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            {/* Hero */}
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
                <h1 className="font-heading text-3xl font-bold md:text-5xl">Despre Noi</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Misiunea noastră este să facem terapia accesibilă și să eliminăm stigmatul din jurul sănătății mintale în Moldova.
                </p>
            </div>

            {/* Mission */}
            <div className="grid gap-12 md:grid-cols-2 items-center mb-20">
                <div className="space-y-6">
                    <h2 className="font-heading text-2xl font-bold md:text-3xl">Povestea Noastră</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Terapie.md a luat naștere din dorința de a crea un spațiu sigur și prietenos unde oamenii pot găsi sprijinul de care au nevoie. Am observat cât de dificil poate fi să găsești un specialist de încredere și am decis să simplificăm acest proces.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Credem că sănătatea mintală este la fel de importantă ca cea fizică și că fiecare persoană merită acces la servicii de calitate, fără judecată.
                    </p>
                </div>
                <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                        alt="Echipa Terapie.md"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Values */}
            <div className="grid gap-8 md:grid-cols-3 mb-20">
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-secondary/10">
                    <div className="p-3 rounded-full bg-background text-primary">
                        <Heart className="h-8 w-8" />
                    </div>
                    <h3 className="font-heading text-xl font-bold">Empatie</h3>
                    <p className="text-muted-foreground">
                        Punem omul pe primul loc și tratăm fiecare situație cu înțelegere și compasiune.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-secondary/10">
                    <div className="p-3 rounded-full bg-background text-primary">
                        <Shield className="h-8 w-8" />
                    </div>
                    <h3 className="font-heading text-xl font-bold">Siguranță</h3>
                    <p className="text-muted-foreground">
                        Asigurăm un mediu confidențial și verificăm riguros toți specialiștii de pe platformă.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-secondary/10">
                    <div className="p-3 rounded-full bg-background text-primary">
                        <Users className="h-8 w-8" />
                    </div>
                    <h3 className="font-heading text-xl font-bold">Comunitate</h3>
                    <p className="text-muted-foreground">
                        Construim o comunitate de suport unde nimeni nu trebuie să treacă singur prin greutăți.
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-primary/5 rounded-3xl p-12">
                <h2 className="font-heading text-2xl font-bold md:text-3xl mb-4">Ești gata să începi?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                    Fă primul pas spre o viață mai echilibrată. Găsește terapeutul potrivit pentru tine astăzi.
                </p>
                <Button size="lg" asChild>
                    <Link href="/terapeuti">Caută Terapeut</Link>
                </Button>
            </div>
        </div>
    );
}
