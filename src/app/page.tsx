import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Shield, Star, MapPin } from "lucide-react";
import { TherapistCard } from "@/components/features/therapists/TherapistCard";
import { RecruitmentCard } from "@/components/features/therapists/RecruitmentCard";
import { FeaturedArticles } from "@/components/features/blog/FeaturedArticles";
import { FAQSection } from "@/components/features/marketing/FAQSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-background">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

            {/* Left Content: Text */}
            <div className="text-center md:text-left space-y-6 order-2 md:order-1">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                Găsește echilibrul - <span className="text-primary">simplu și natural.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto md:mx-0">
                Evită căutările interminabile. Construit de psihologi, serviciul nostru îmbină grija umană cu tehnologia pentru a te ghida către terapeutul potrivit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/terapeuti">
                    Găsește Terapeut
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content: Illustration */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="w-56 h-56 md:w-[28rem] md:h-[28rem] bg-accent rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 animate-pulse"></div>
                <img src="/hero_illustration.png" alt="Finding Balance" className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-700" />
              </div>
            </div>

          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-muted-foreground opacity-80 mt-16 md:mt-24">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Rapid & Convenabil</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Sigur & Anonim</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <span>Potriviri Personalizate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section (It's Complicated Style) */}
      <section className="py-24 bg-accent/30">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-6">
              <Star className="w-6 h-6 text-secondary fill-secondary" />
              <Star className="w-6 h-6 text-secondary fill-secondary" />
              <Star className="w-6 h-6 text-secondary fill-secondary" />
              <Star className="w-6 h-6 text-secondary fill-secondary" />
              <Star className="w-6 h-6 text-secondary fill-secondary" />
            </div>
            <h3 className="text-2xl md:text-4xl font-heading text-foreground font-medium leading-normal">
              "Vă mulțumesc mult pentru recomandările personalizate! Am contactat unul dintre terapeuți și am avut deja prima ședință. Pare <span className="text-primary font-bold">foarte promițător!</span>"
            </h3>
          </div>
          <p className="text-lg text-muted-foreground font-medium">Anonymous client</p>
        </div>
      </section>

      {/* Directory Preview */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Explorează Directorul</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Preferi să alegi singur? Răsfoiește directorul nostru cu specialiști verificați din toată țara.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground border-b border-border pb-2">După Oraș</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/terapeuti?location=Chișinău" className="hover:text-primary transition-colors">Chișinău</Link></li>
                <li><Link href="/terapeuti?location=Bălți" className="hover:text-primary transition-colors">Bălți</Link></li>
                <li><Link href="/terapeuti?location=Cahul" className="hover:text-primary transition-colors">Cahul</Link></li>
                <li><Link href="/terapeuti?location=Ungheni" className="hover:text-primary transition-colors">Ungheni</Link></li>
                <li><Link href="/orase" className="font-medium text-primary hover:underline">Vezi toate orașele</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground border-b border-border pb-2">După Specializare</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/terapeuti?specialization=Depresie" className="hover:text-primary transition-colors">Depresie</Link></li>
                <li><Link href="/terapeuti?specialization=Anxietate" className="hover:text-primary transition-colors">Anxietate</Link></li>
                <li><Link href="/terapeuti?specialization=Relații de Cuplu" className="hover:text-primary transition-colors">Relații de cuplu</Link></li>
                <li><Link href="/terapeuti?specialization=Traumă" className="hover:text-primary transition-colors">Traume</Link></li>
                <li><Link href="/specializari" className="font-medium text-primary hover:underline">Vezi toate specializările</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground border-b border-border pb-2">După Abordare</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/terapeuti?approach=Terapie Cognitiv-Comportamentală" className="hover:text-primary transition-colors">Terapie Cognitiv-Comportamentală</Link></li>
                <li><Link href="/terapeuti?approach=Psihanaliză" className="hover:text-primary transition-colors">Psihanaliză</Link></li>
                <li><Link href="/terapeuti?approach=Umanistă" className="hover:text-primary transition-colors">Umanistă</Link></li>
                <li><Link href="/terapeuti?approach=Integrativă" className="hover:text-primary transition-colors">Integrativă</Link></li>
                <li><Link href="/abordari" className="font-medium text-primary hover:underline">Vezi toate abordările</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Therapists (kept as grid) */}
      <section className="py-24 bg-accent/20">
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

      {/* Featured Blog Posts */}
      <FeaturedArticles />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
