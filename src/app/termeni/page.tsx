export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-4xl">
            <h1 className="font-heading text-3xl font-bold md:text-4xl mb-8">Termeni și Condiții</h1>

            <div className="prose prose-gray max-w-none space-y-6 text-muted-foreground">
                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">1. Acceptarea Termenilor</h2>
                    <p>
                        Prin accesarea și utilizarea platformei Terapie.md, sunteți de acord să respectați și să fiți legat de acești termeni și condiții. Dacă nu sunteți de acord cu oricare dintre acești termeni, vă rugăm să nu utilizați platforma.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">2. Utilizarea Platformei</h2>
                    <p>
                        Terapie.md este o platformă care conectează utilizatorii cu specialiști în sănătate mintală. Platforma servește ca un intermediar și nu oferă direct servicii terapeutice.
                    </p>
                    <p className="mt-3">
                        Utilizatorii platformei se angajează să:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Furnizeze informații corecte și actualizate</li>
                        <li>Nu utilizeze platforma în scopuri ilegale sau neautorizate</li>
                        <li>Respecte confidențialitatea altor utilizatori</li>
                        <li>Nu transmită conținut dăunător sau ofensator</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">3. Responsabilități</h2>
                    <p>
                        Terapie.md depune eforturi pentru a verifica calificările specialiștilor listați pe platformă, dar nu își asumă responsabilitatea pentru calitatea serviciilor furnizate de aceștia. Relația terapeutică este stabilită direct între utilizator și terapeut.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">4. Confidențialitate</h2>
                    <p>
                        Înțelegem importanța confidențialității în contextul sănătății mintale. Pentru detalii despre cum colectăm, utilizăm și protejăm datele dumneavoastră personale, vă rugăm să consultați{" "}
                        <a href="/confidentialitate" className="text-primary hover:underline">
                            Politica de Confidențialitate
                        </a>.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">5. Plăți și Anulări</h2>
                    <p>
                        Tarifele pentru serviciile terapeutice sunt stabilite de fiecare specialist în parte. Politicile de anulare și rambursare variază în funcție de terapeut și vor fi comunicate înainte de confirmarea programării.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">6. Modificări ale Termenilor</h2>
                    <p>
                        Terapie.md își rezervă dreptul de a modifica acești termeni în orice moment. Modificările vor fi postate pe această pagină, iar utilizarea continuă a platformei după aceste schimbări constituie acceptarea noilor termeni.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">7. Contact</h2>
                    <p>
                        Pentru întrebări legate de acești termeni, vă rugăm să ne contactați la:{" "}
                        <a href="mailto:legal@terapie.md" className="text-primary hover:underline">
                            legal@terapie.md
                        </a>
                    </p>
                </section>

                <p className="text-sm pt-6 border-t">
                    Ultima actualizare: Decembrie 2025
                </p>
            </div>
        </div>
    );
}
