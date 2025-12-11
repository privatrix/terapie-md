import Link from "next/link";
import { Facebook, Instagram, Linkedin, ShieldCheck, Lock } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full flex flex-col">
            {/* Upper Footer - Main Content */}
            <div className="bg-slate-50 border-t py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">

                        {/* Brand Column */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="font-heading text-xl font-bold text-primary">
                                    Terapie.md
                                </span>
                            </Link>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Regăsește echilibrul și sănătatea mintală alături de cei mai buni specialiști.
                                O platformă sigură și dedicată stării tale de bine.
                            </p>
                        </div>

                        {/* Quick Links Column */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <h3 className="font-semibold text-foreground">Navigare Rapidă</h3>
                            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                                <Link href="/" className="hover:text-primary transition-colors">
                                    Acasă
                                </Link>
                                <Link href="/terapeuti" className="hover:text-primary transition-colors">
                                    Terapeuți
                                </Link>
                                <Link href="/oferte" className="hover:text-primary transition-colors">
                                    Oferte
                                </Link>
                                <Link href="/despre" className="hover:text-primary transition-colors">
                                    Despre Noi
                                </Link>
                                <Link href="/contact" className="hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </nav>
                        </div>

                        {/* Contact / Call to Action Column (could act as placeholder or specific contact info) */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <h3 className="font-semibold text-foreground">Ai nevoie de ajutor?</h3>
                            <p className="text-sm text-muted-foreground">
                                Echipa noastră este aici pentru tine.
                            </p>
                            <Link href="/contact" className="text-sm font-medium text-primary hover:underline">
                                Scrie-ne un mesaj &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Legal & Trust (The Floor) */}
            <div className="bg-white py-6 border-t border-slate-100">
                <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Left: Copyright */}
                    <div className="text-xs text-muted-foreground order-3 md:order-1">
                        &copy; {new Date().getFullYear()} Terapie.md. Toate drepturile rezervate.
                    </div>

                    {/* Center: Trust Badges */}
                    <div className="flex items-center gap-6 justify-center order-2 md:order-2">
                        <div className="flex items-center gap-1.5 text-muted-foreground/80 hover:text-primary transition-colors" title="GDPR Compliant">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">GDPR</span>
                        </div>
                        <div className="h-4 w-px bg-slate-300 hidden md:block" />
                        <div className="flex items-center gap-1.5 text-muted-foreground/80 hover:text-primary transition-colors" title="Encrypted Data">
                            <Lock className="h-4 w-4" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">SSL Secure</span>
                        </div>
                    </div>

                    {/* Right: Legal & Social */}
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 order-1 md:order-3">
                        <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                            <Link href="/termeni" className="hover:text-primary transition-colors">
                                Termeni
                            </Link>
                            <Link href="/confidentialitate" className="hover:text-primary transition-colors">
                                Confidențialitate
                            </Link>
                        </div>

                        <div className="flex gap-3">
                            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-4 w-4" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-4 w-4" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-4 w-4" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
