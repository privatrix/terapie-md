import Link from "next/link";
import { Facebook, Instagram, Linkedin, ShieldCheck, Lock } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-6 md:py-12">
            <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
                <div className="flex flex-col items-center gap-2 md:items-start">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-heading text-xl font-bold text-primary">
                            Terapie.md
                        </span>
                    </Link>
                    <p className="text-center text-sm text-muted-foreground md:text-left">
                        &copy; {new Date().getFullYear()} Terapie.md. Toate drepturile rezervate.
                    </p>
                </div>
                <nav className="flex gap-4 sm:gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/termeni" className="hover:text-primary transition-colors">
                        Termeni și Condiții
                    </Link>
                    <Link href="/confidentialitate" className="hover:text-primary transition-colors">
                        Confidențialitate
                    </Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>
                <div className="flex gap-4">
                    <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Facebook className="h-5 w-5" />
                        <span className="sr-only">Facebook</span>
                    </Link>
                    <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                </div>
            </div>

            {/* Trust Badges Section */}
            <div className="container mx-auto px-4 md:px-6 mt-8 pt-8 border-t flex flex-col items-center text-center gap-4">
                <div className="flex items-center gap-6 justify-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="h-6 w-6" />
                        <span className="text-xs font-medium">GDPR Compliant</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Lock className="h-6 w-6" />
                        <span className="text-xs font-medium">Date Criptate</span>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground max-w-md">
                    Platformă conformă standardelor GDPR. Datele tale sunt criptate și confidențiale.
                </p>
            </div>
        </footer>
    );
}
