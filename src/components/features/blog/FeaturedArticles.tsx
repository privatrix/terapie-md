import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    image_url: string | null;
    tags: string[];
    author_name: string;
    published_at: string;
}

export async function FeaturedArticles() {
    const supabase = createClient();

    // Fetch 3 latest articles
    const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(3);

    if (error || !articles || articles.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">
                            Resurse pentru <span className="text-primary">Echilibrul Tău</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Articole și sfaturi practice de la specialiștii noștri.
                        </p>
                    </div>
                    <Button variant="outline" className="hidden md:flex gap-2" asChild>
                        <Link href="/articole">
                            Toate Articolele <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {articles.map((article) => (
                        <Link key={article.id} href={`/articole/${article.slug}`} className="group h-full">
                            <Card className="h-full flex flex-col overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group-hover:-translate-y-1 rounded-2xl">
                                <div className="aspect-[16/10] overflow-hidden relative bg-gray-100">
                                    <img
                                        src={article.image_url || "/blog-placeholder.jpg"}
                                        alt={article.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {article.tags && article.tags.length > 0 && (
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-white/90 text-primary hover:bg-white text-xs font-medium px-2 py-1 shadow-sm backdrop-blur-sm border-0">
                                                {article.tags[0]}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <CardContent className="flex-1 p-6 space-y-3">
                                    <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                        {article.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                        {article.excerpt}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-6 pt-0 mt-auto flex justify-between items-center text-xs text-muted-foreground border-t border-gray-50/50">
                                    <span className="font-medium text-gray-600">{article.author_name}</span>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>5 min</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="text-center md:hidden">
                    <Button variant="outline" className="w-full gap-2" asChild>
                        <Link href="/articole">
                            Toate Articolele <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
