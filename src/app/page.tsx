import { TherapistCard } from "@/components/features/therapists/TherapistCard";
import { RecruitmentCard } from "@/components/features/therapists/RecruitmentCard";

// ...

// ... inside Header/Hero ...

// ... Featured section ...
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: "Dr. Elena Popescu",
                title: "Psihoterapeut Integrativ",
                imageUrl: "/therapist-1.png", // renamed image -> imageUrl to match component prop?
                // Actually TherapistCard expects `photo_url` or `imageUrl`? 
                // Looking at TherapistCard code from previous turns: uses `photo_url` mainly but fallback?
                // Let's check TherapistCard props. It uses `therapist` object.
                // In `page.tsx` (TherapistsPage), we mapped `imageUrl: t.photo_url`.
                // Let's check TherapistCard definition again or just provide compatible object.
                // Assuming it takes `photo_url` or `imageUrl`. I'll provide both or check.
                photo_url: "/therapist-1.png",
                specialties: ["Anxietate", "Depresie"],
                desc: "Specializată în anxietate, depresie și probleme de relaționare. Peste 10 ani de experiență.",
                // TherapistCard might need rating/reviews
                rating: 4.9,
                reviewCount: 24,
                priceRange: "800 MDL"
              },
              {
                id: 2,
                name: "Dr. Andrei Radu",
                title: "Psiholog Clinician",
                photo_url: "/therapist-2.png",
                specialties: ["Traumă", "Burnout"],
                desc: "Expert în gestionarea stresului și recuperarea post-traumatică.",
                rating: 4.8,
                reviewCount: 18,
                priceRange: "700 MDL"
              },
              {
                 id: "recruitment-home",
                 isRecruitment: true
              }
            ].map((therapist: any) => (
               therapist.isRecruitment ? (
                   <RecruitmentCard key={therapist.id} />
               ) : (
                   <div key={therapist.id} className="h-full"> 
                        {/* Wrap in h-full to match grid height */}
                       <TherapistCard therapist={therapist} />
                   </div>
               )
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/terapeuti">
                Vezi Toți Terapeuții
              </Link>
            </Button>
          </div>
        </div >
      </section >
    </div >
  );
}
