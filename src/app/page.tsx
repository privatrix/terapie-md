import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Găsește-ți <span className="text-primary">liniștea interioară</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Conectăm moldovenii cu cei mai buni specialiști în sănătate mintală.
              Platformă sigură, confidențială și ușor de utilizat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/terapeuti">
                  Caută Terapeut <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/specialisti">
                  Pentru Specialiști
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">Specialiști Verificați</h3>
              <p className="text-muted-foreground">
                Toți terapeuții sunt verificați manual pentru a asigura cele mai înalte standarde de profesionalism.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">Confidențialitate</h3>
              <p className="text-muted-foreground">
                Datele tale sunt în siguranță. Oferim o platformă securizată pentru liniștea ta.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">Programări Ușoare</h3>
              <p className="text-muted-foreground">
                Găsește intervalul potrivit și programează-te online în câteva minute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Therapists (Mock) */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Specialiști Recomandați
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Descoperă câțiva dintre terapeuții noștri de top.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: "Dr. Elena Popescu",
                title: "Psihoterapeut Integrativ",
                image: "/therapist-1.png",
                specialties: ["Anxietate", "Depresie"],
                desc: "Specializată în anxietate, depresie și probleme de relaționare. Peste 10 ani de experiență."
              },
              {
                id: 2,
                name: "Dr. Andrei Radu",
                title: "Psiholog Clinician",
                image: "/therapist-2.png",
                specialties: ["Traumă", "Burnout"],
                desc: "Expert în gestionarea stresului și recuperarea post-traumatică. Abordare empatică și modernă."
              },
              {
                id: 3,
                name: "Dr. Maria Ionescu",
                title: "Consilier de Cuplu",
                image: "/therapist-3.png",
                specialties: ["Relații", "Comunicare"],
                desc: "Ajut cuplurile să regăsească armonia și să comunice eficient. Terapie sistemică de familie."
              }
            ].map((therapist) => (
              <div key={therapist.id} className="bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-64 w-full relative">
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold">{therapist.name}</h3>
                    <p className="text-sm text-primary font-medium">{therapist.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {therapist.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {therapist.specialties.map(s => (
                      <span key={s} className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                  <Button className="w-full font-semibold" asChild>
                    <Link href={`/terapeuti/${therapist.id}`}>Vezi Profil</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/terapeuti">
                Vezi Toți Terapeuții
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
