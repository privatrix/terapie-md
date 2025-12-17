import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, User, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { ArticleGrid } from "@/components/features/blog/ArticleGrid";

// SEO Metadata
export const metadata = {
    title: "Blog - Terapie.md | Resurse pentru Sănătate Mintală",
    description: "Articole, sfaturi și ghiduri despre psihoterapie, anxietate, depresie și dezvoltare personală, scrise de specialiști.",
};

export const dynamic = 'force-dynamic';

async function getArticles() {
    const supabase = createClient();

    // 1. Fetch Featured Article (Tag: 'Recomandat')
    const { data: featuredData } = await supabase
        .from('articles')
        .select('*')
        .contains('tags', ['Recomandat'])
        .limit(1)
        .single();

    // 2. Fetch Recent Articles (excluding the featured one if it exists)
    let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(7);

    if (featuredData) {
        query = query.neq('id', featuredData.id);
    }

    const { data: recentData, error } = await query;

    if (error) {
        console.error("Error fetching articles:", error);
        return [];
    }

    const allArticles = [];
    if (featuredData) allArticles.push(featuredData);
    if (recentData) allArticles.push(...recentData);

    return allArticles;
}

export default async function BlogPage() {
    const articles = await getArticles();
    // Assuming getArticles puts Featured first if it exists.
    // Logic: Featured (if found) is at [0]. Recent follow.
    // If no featured found, [0] is just the latest recent.

    // Verification check:
    // If [0] has Recomandat tag, it's the featured one.
    // If not, we trigger the "No Featured" UI or just show latest as featured?
    // User requested "Manual selection". If none selected, fallback to latest is acceptable.

    const featuredArticle = articles.length > 0 ? articles[0] : null;
    const recentArticles = articles.length > 1 ? articles.slice(1) : [];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Hero Section */}
            <div className="bg-primary/5 border-b border-primary/10 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        Blog & Resurse
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Explorează articole scrise de specialiști pentru a te ghida în călătoria ta spre echilibru emoțional.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                {articles.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>Încă nu există articole publicate.</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Article */}
                        {featuredArticle && (
                            <div className="mb-16">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <span className="bg-primary w-2 h-8 rounded-full" />
                                    Articol Recomandat
                                </h2>
                                <Link href={`/articole/${featuredArticle.slug}`} className="group block">
                                    <div className="grid md:grid-cols-2 gap-8 bg-white border-0 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                        <div className="h-full min-h-[300px] w-full overflow-hidden relative">
                                            <img
                                                src={featuredArticle.image_url || "/blog-placeholder.jpg"}
                                                alt={featuredArticle.title}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-white/90 text-primary hover:bg-white text-sm font-medium px-3 py-1 shadow-sm backdrop-blur-sm">
                                                    Nou
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="p-8 md:p-12 space-y-6">
                                            <div className="flex flex-wrap gap-2">
                                                {featuredArticle.tags?.map((tag: string) => (
                                                    <Badge key={tag} variant="secondary" className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <h3 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                                                {featuredArticle.title}
                                            </h3>
                                            <p className="text-lg text-muted-foreground line-clamp-3">
                                                {featuredArticle.excerpt}
                                            </p>
                                            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-medium text-gray-700">{featuredArticle.author_name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4" />
                                                    <span>{format(new Date(featuredArticle.published_at), 'd MMM yyyy', { locale: ro })}</span>
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <Button size="lg" className="group-hover:translate-x-1 transition-transform">
                                                    Citește Articolul <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Recent Articles Grid - Dynamic now */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                <span className="bg-gray-200 w-2 h-8 rounded-full" />
                                Recente
                            </h2>

                            <ArticleGrid initialArticles={recentArticles} />

                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
