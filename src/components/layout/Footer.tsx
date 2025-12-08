import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

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
        </footer>
    );
}
