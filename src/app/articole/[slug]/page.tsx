import { createClient } from "@/lib/supabase/client";
import { ShareButton } from "@/components/blog/ShareButton";
import { SocialShareButtons } from "@/components/blog/SocialShareButtons";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ro } from "date-fns/locale";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = createClient();
    const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();

    if (!article) return { title: 'Articolul nu a fost găsit' };

    return {
        title: `${article.title} - Blog Terapie.md`,
        description: article.excerpt,
        openGraph: {
            images: [article.image_url],
        },
    };
}

async function getArticle(slug: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) return null;
    return data;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Scroll Progress Bar (Optional - simple fixed top) */}

            <div className="container mx-auto px-4 md:px-6 pt-8 max-w-4xl flex items-center justify-between">
                <Link href="/articole" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Înapoi la Blog
                </Link>
                <ShareButton title={article.title} />
            </div>

            <article className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
                {/* Header */}
                <header className="mb-12 text-center space-y-6">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {article.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm bg-primary/5 text-primary border-primary/10">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src="/placeholder-author.jpg" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-700">{article.author_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{format(new Date(article.published_at), 'd MMMM yyyy', { locale: ro })}</span>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="aspect-video w-full overflow-hidden rounded-3xl shadow-lg mb-16 relative">
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Content */}
                <div className="prose prose-lg md:prose-xl prose-gray mx-auto prose-headings:font-heading prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
                    {/* 
                      Native simple renderer for now to avoid 'react-markdown' dependency if not installed.
                      Ideally we use a markdown library. For this example, I'll just render raw text formatted with strict newlines 
                      or assume similar handling. 
                      
                      If we really want to render Markdown, I should check if 'react-markdown' is in package.json.
                      It is NOT in the viewed package.json. 
                      So I will implement a very basic parser or just display whitespace-pre-wrap for MVP.
                    */}
                    {/* Render HTML Content from Tiptap */}
                    <div
                        className="font-serif leading-relaxed text-gray-800"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* Footer Share */}
                <div className="mt-16 pt-8 border-t flex justify-between items-center">
                    <p className="font-bold text-lg">Ți-a plăcut articolul?</p>
                    <div className="flex gap-2">
                        <SocialShareButtons title={article.title} />
                    </div>
                </div>
            </article>

            {/* Newsletter / CTA Section could go here */}
        </div>
    );
}
