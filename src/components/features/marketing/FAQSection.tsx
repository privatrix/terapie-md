"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
    {
        question: "Cum funcționează Terapie.md?",
        answer: "Terapie.md este o platformă care conectează persoanele în căutare de suport psihologic cu specialiști verificați. Poți răsfoi profilurile terapeuților, filtra după specializare și preț, și solicita o programare direct online."
    },
    {
        question: "Cât costă o ședință de terapie?",
        answer: "Prețurile variază în funcție de terapeut și de experiența acestuia. În medie, o ședință costă între 400 și 800 MDL. Fiecare terapeut are tarifele afișate transparent pe profilul său."
    },
    {
        question: "Cum știu dacă terapeutul este verificat?",
        answer: "Toți specialiștii de pe platforma noastră trec printr-un proces riguros de verificare a acreditărilor și experienței înainte de a fi listați. Căutăm să oferim doar servicii de înaltă calitate și siguranță."
    },
    {
        question: "Pot anula o programare?",
        answer: "Da, poți anula sau reprograma o ședință. Politica exactă de anulare depinde de fiecare terapeut în parte, dar de obicei solicităm un preaviz de 24 de ore."
    },
    {
        question: "Oferiți suport pentru situații de urgență?",
        answer: "Nu, Terapie.md nu este un serviciu de urgență. Dacă te afli într-o situație de criză sau pericol iminent, te rugăm să suni la 112 sau să te adresezi celui mai apropiat spital de urgență."
    }
];

export function FAQSection() {
    return (
        <section id="faq" className="py-16 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                        Întrebări Frecvente
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Răspunsuri la cele mai comune întrebări despre terapie și utilizarea platformei noastre.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        {FAQS.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b-gray-200">
                                <AccordionTrigger className="text-left font-medium text-lg py-4 hover:no-underline hover:text-primary transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
