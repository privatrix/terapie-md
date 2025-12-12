import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Shield } from "lucide-react";
import { TherapistCard } from "@/components/features/therapists/TherapistCard";
import { RecruitmentCard } from "@/components/features/therapists/RecruitmentCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
            alt="Relaxing therapy atmosphere"
            className="w-full h-full object-cover object-center sm:object-right opacity-30 select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-start text-left max-w-[90%] md:max-w-2xl space-y-8 md:space-y-10">
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Regăsește <span className="text-primary block mt-2">echilibrul interior</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-[90%]">
              Descoperă sprijinul personalizat de care ai nevoie printr-o platformă sigură și confidențială, conectându-te cu experți dedicați stării tale de bine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg gap-2" asChild>
                <Link href="/terapeuti">
                  Caută Terapeut <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 bg-background/50 backdrop-blur-sm hover:bg-background/80" asChild>
                <Link href="/aplicare-terapeut">
                  Aplică ca Terapeut
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          {/* Mobile: Horizontal Scroll | Desktop: Grid */}
          <div className="flex flex-row overflow-x-auto pb-6 gap-4 md:grid md:grid-cols-3 md:gap-8 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">

            {/* Card 1 */}
            <div className="min-w-[85vw] md:min-w-0 snap-center flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white hover:bg-white transition-colors border shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">Specialiști Verificați</h3>
              <p className="text-muted-foreground">
                Toți terapeuții sunt verificați manual pentru a asigura cele mai înalte standarde de profesionalism.
              </p>
            </div>

            {/* Card 2 */}
            <div className="min-w-[85vw] md:min-w-0 snap-center flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white hover:bg-white transition-colors border shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">Confidențialitate</h3>
              <p className="text-muted-foreground">
                Datele tale sunt în siguranță. Oferim o platformă securizată pentru liniștea ta.
              </p>
            </div>

            {/* Card 3 */}
            <div className="min-w-[85vw] md:min-w-0 snap-center flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white hover:bg-white transition-colors border shadow-sm">
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
            {[1, 2, 3].map((id) => (
              <RecruitmentCard key={id} />
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
