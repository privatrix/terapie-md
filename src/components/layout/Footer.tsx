import Link from "next/link";
import { Facebook, Instagram, Linkedin, ShieldCheck, Lock } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full flex flex-col bg-background/50 border-t border-border/50">
            {/* Upper Footer - Main Content */}
            <div className="py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start text-center md:text-left">

                        {/* Brand Column */}
                        <div className="flex flex-col items-center md:items-start gap-6 md:col-span-2">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="font-heading text-2xl font-bold text-primary">
                                    Terapie.md
                                </span>
                            </Link>
                            <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
                                Regăsește echilibrul și sănătatea mintală alături de cei mai buni specialiști.
                                O platformă sigură și dedicată stării tale de bine.
                            </p>
                            <div className="flex gap-4 mt-2">
                                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-accent/50 text-foreground hover:bg-primary hover:text-white transition-all">
                                    <Facebook className="h-5 w-5" />
                                    <span className="sr-only">Facebook</span>
                                </Link>
                                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-accent/50 text-foreground hover:bg-primary hover:text-white transition-all">
                                    <Instagram className="h-5 w-5" />
                                    <span className="sr-only">Instagram</span>
                                </Link>
                                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-accent/50 text-foreground hover:bg-primary hover:text-white transition-all">
                                    <Linkedin className="h-5 w-5" />
                                    <span className="sr-only">LinkedIn</span>
                                </Link>
                            </div>
                        </div>

                        {/* Link Columns */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <h3 className="font-heading font-semibold text-lg text-foreground">Explorare</h3>
                            <nav className="flex flex-col gap-3 text-base text-muted-foreground/80">
                                <Link href="/terapeuti" className="hover:text-primary transition-colors">Găsește Terapeut</Link>
                                <Link href="/oferte" className="hover:text-primary transition-colors">Oferte Wellness</Link>
                                <Link href="/despre" className="hover:text-primary transition-colors">Despre Noi</Link>
                                <Link href="/articole" className="hover:text-primary transition-colors">Blog</Link>
                            </nav>
                        </div>

                        <div className="flex flex-col items-center md:items-start gap-4">
                            <h3 className="font-heading font-semibold text-lg text-foreground">Suport</h3>
                            <nav className="flex flex-col gap-3 text-base text-muted-foreground/80">
                                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                                <Link href="/#faq" className="hover:text-primary transition-colors">Întrebări Frecvente</Link>
                                <Link href="/pentru-terapeuti" className="hover:text-primary transition-colors">Pentru Specialiști</Link>
                                <Link href="/termeni" className="hover:text-primary transition-colors">Termeni și Condiții</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Legal & Trust */}
            <div className="py-8 border-t border-border/50">
                <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-70">
                    <div className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Terapie.md
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <ShieldCheck className="h-4 w-4" />
                            <span>GDPR Ready</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <Lock className="h-4 w-4" />
                            <span>SECURE</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
