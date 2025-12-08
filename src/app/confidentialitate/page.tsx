export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-4xl">
            <h1 className="font-heading text-3xl font-bold md:text-4xl mb-8">Politica de Confidențialitate</h1>

            <div className="prose prose-gray max-w-none space-y-6 text-muted-foreground">
                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">1. Introducere</h2>
                    <p>
                        La Terapie.md, confidențialitatea datelor dumneavoastră este o prioritate. Această politică explică ce informații colectăm, cum le folosim și cum le protejăm.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">2. Informații pe care le Colectăm</h2>
                    <p>
                        Colectăm următoarele tipuri de informații:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Informații de cont:</strong> Nume, adresă de email, număr de telefon</li>
                        <li><strong>Informații de profil:</strong> Vârstă, gen, motiv pentru căutarea terapiei (opțional)</li>
                        <li><strong>Informații de utilizare:</strong> Istoricul căutărilor, programările efectuate</li>
                        <li><strong>Informații tehnice:</strong> Adresa IP, tipul browserului, sistemul de operare</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">3. Cum Utilizăm Informațiile</h2>
                    <p>
                        Utilizăm informațiile colectate pentru:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Facilitarea conectării cu specialiști potriviți</li>
                        <li>Îmbunătățirea funcționalității platformei</li>
                        <li>Comunicarea cu dumneavoastră despre programări și actualizări</li>
                        <li>Asigurarea securității platformei</li>
                        <li>Respectarea obligațiilor legale</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">4. Partajarea Informațiilor</h2>
                    <p>
                        Nu vindem și nu închiriem informațiile dumneavoastră personale. Partajăm informații doar în următoarele situații:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Cu specialiștii pe care îi contactați prin platformă</li>
                        <li>Cu furnizori de servicii care ne ajută să operăm platforma (ex: hosting, procesare plăți)</li>
                        <li>Când este cerut de lege sau pentru protejarea drepturilor noastre legale</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">5. Securitatea Datelor</h2>
                    <p>
                        Implementăm măsuri de securitate tehnice și organizaționale pentru a proteja informațiile dumneavoastră personale împotriva accesului neautorizat, modificării, divulgării sau distrugerii. Acestea includ criptarea datelor, controale de acces și monitorizarea sistemelor.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">6. Drepturile Dumneavoastră</h2>
                    <p>
                        Aveți următoarele drepturi în legătură cu datele dumneavoastră personale:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Dreptul de acces la datele personale</li>
                        <li>Dreptul la rectificarea datelor inexacte</li>
                        <li>Dreptul la ștergerea datelor ("dreptul de a fi uitat")</li>
                        <li>Dreptul la restricționarea prelucrării</li>
                        <li>Dreptul la portabilitatea datelor</li>
                        <li>Dreptul de a vă opune prelucrării</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">7. Cookie-uri</h2>
                    <p>
                        Utilizăm cookie-uri și tehnologii similare pentru a îmbunătăți experiența pe platformă, pentru analiză și pentru a personaliza conținutul. Puteți gestiona preferințele cookie-urilor prin setările browserului.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">8. Modificări ale Politicii</h2>
                    <p>
                        Ne rezervăm dreptul de a modifica această politică de confidențialitate. Orice modificări vor fi postate pe această pagină, iar dacă acestea sunt semnificative, vă vom notifica printr-un email.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4">9. Contact</h2>
                    <p>
                        Pentru orice întrebări sau solicitări legate de confidențialitatea datelor, vă rugăm să ne contactați la:{" "}
                        <a href="mailto:privacy@terapie.md" className="text-primary hover:underline">
                            privacy@terapie.md
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
