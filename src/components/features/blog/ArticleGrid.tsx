"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Loader2 } from "lucide-react";
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

interface ArticleGridProps {
    initialArticles: Article[];
}

const ITEMS_PER_PAGE = 6;

export function ArticleGrid({ initialArticles }: ArticleGridProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [offset, setOffset] = useState(initialArticles.length);
    const [hasMore, setHasMore] = useState(true); // Assume true initially if we have a full page, or check count
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        setLoading(true);
        const supabase = createClient();

        // We need to skip the first one (Featured) + the ones we already loaded.
        // Wait, the parent page passed `recentArticles` (slice(1)). 
        // So `initialArticles` contains items 2..N.
        // The total offset to skip in DB is 1 (featured) + offset (already loaded recent).

        // Actually simpler: just offset by total loaded + 1.
        // Or better: pass the actual DB offset.

        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('published_at', { ascending: false })
            .range(offset + 1, offset + 1 + ITEMS_PER_PAGE - 1); // +1 because we skip the very first featured one in the total numbering logic if we consider consistent sorting

        if (error) {
            console.error("Error loading more articles:", error);
            setLoading(false);
            return;
        }

        if (data && data.length > 0) {
            setArticles([...articles, ...data]);
            setOffset(offset + data.length);
            if (data.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }
        } else {
            setHasMore(false);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <Link key={article.id} href={`/articole/${article.slug}`} className="group h-full">
                        <Card className="h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group-hover:-translate-y-1">
                            <div className="aspect-[16/10] overflow-hidden relative">
                                <img
                                    src={article.image_url || "/blog-placeholder.jpg"}
                                    alt={article.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <CardContent className="flex-1 p-6 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {article.tags?.slice(0, 2).map((tag: string) => (
                                        <Badge key={tag} variant="outline" className="text-xs font-normal border-gray-200 text-muted-foreground">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-3">
                                    {article.excerpt}
                                </p>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 border-t border-gray-50 flex justify-between items-center text-xs text-muted-foreground mt-auto">
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

            {hasMore && (
                <div className="flex justify-center pt-8">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={loadMore}
                        disabled={loading}
                        className="rounded-full px-8 h-12 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Se încarcă...
                            </>
                        ) : (
                            "Încarcă mai multe articole"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
