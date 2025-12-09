"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
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

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                </nav>
                <div className="flex items-center gap-4">
                    {user ? (
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
                    ) : (
                        <>
                            <Button variant="outline" className="hidden md:inline-flex" asChild>
                                <Link href="/auth/login">Intră în cont</Link>
                            </Button>
                            <Button className="hidden md:inline-flex" asChild>
                                <Link href="/specialisti">Pentru Specialiști</Link>
                            </Button>
                        </>
                    )}
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

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <nav className="container mx-auto flex flex-col space-y-4 p-4">
                        <Link
                            href="/"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Acasă
                        </Link>
                        <Link
                            href="/terapeuti"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Terapeuți
                        </Link>
                        <Link
                            href="/oferte"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Oferte
                        </Link>
                        <Link
                            href="/despre"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Despre Noi
                        </Link>
                        <div className="flex flex-col gap-2 pt-4 border-t">
                            {user ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        className="w-full gap-2 justify-start"
                                        asChild
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Link href="/dashboard">
                                            <User className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Ieși din cont
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/auth/login">Intră în cont</Link>
                                    </Button>
                                    <Button className="w-full" asChild>
                                        <Link href="/specialisti">Pentru Specialiști</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
