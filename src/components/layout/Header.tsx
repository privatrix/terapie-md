"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide on scroll down (if > 10px), show on scroll up
            if (currentScrollY > lastScrollY.current && currentScrollY > 10) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMounted(true);

        // Skip auth if Supabase not configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return;
        }

        const supabase = createClient();

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    // Hide user controls on password update page to prevent "logged in" confusion
    const isUpdatePasswordPage = typeof window !== 'undefined' && window.location.pathname === '/auth/update-password';

    return (
        <>
            <header className={`sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-heading text-xl font-bold text-primary">
                            Terapie.md
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
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
                        <Link href="/articole" className="hover:text-primary transition-colors">
                            Blog
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        {user && !isUpdatePasswordPage ? (
                            <>
                                <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild>
                                    <Link href="/dashboard">
                                        <User className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="hidden md:inline-flex gap-2"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Ieși din cont
                                </Button>
                            </>
                        ) : !user ? (
                            <>
                                <Button variant="outline" className="hidden md:inline-flex" asChild>
                                    <Link href="/auth/login">Intră în cont</Link>
                                </Button>
                                <Button className="hidden md:inline-flex" asChild>
                                    <Link href="/specialisti">Pentru Specialiști</Link>
                                </Button>
                            </>
                        ) : null}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden h-11 w-11"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </div>
                </div>
            </header>

            {mounted && mobileMenuOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 md:hidden animate-mobile-enter" suppressHydrationWarning>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 h-12 w-12"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <X className="h-8 w-8" />
                        <span className="sr-only">Close menu</span>
                    </Button>

                    <nav className="flex flex-col items-center space-y-8">
                        <Link
                            href="/"
                            className="text-2xl font-semibold hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Acasă
                        </Link>
                        <Link
                            href="/terapeuti"
                            className="text-2xl font-semibold hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Terapeuți
                        </Link>
                        <Link
                            href="/oferte"
                            className="text-2xl font-semibold hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Oferte
                        </Link>
                        <Link
                            href="/despre"
                            className="text-2xl font-semibold hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Despre Noi
                        </Link>
                        <Link
                            href="/articole"
                            className="text-2xl font-semibold hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Blog
                        </Link>

                        <div className="flex flex-col gap-4 mt-8 w-[280px]">
                            {user && !isUpdatePasswordPage ? (
                                <>
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="w-full text-lg h-12"
                                        asChild
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Link href="/dashboard">
                                            <User className="mr-2 h-5 w-5" />
                                            Dashboard
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full text-lg h-12"
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <LogOut className="mr-2 h-5 w-5" />
                                        Ieși din cont
                                    </Button>
                                </>
                            ) : !user ? (
                                <>
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="w-full text-lg h-12"
                                        asChild
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Link href="/auth/login">Intră în cont</Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full text-lg h-12 bg-transparent border-2"
                                        asChild
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Link href="/specialisti">Pentru Specialiști</Link>
                                    </Button>
                                </>
                            ) : null}
                        </div>
                    </nav>
                </div>,
                document.body
            )}
        </>
    );
}
