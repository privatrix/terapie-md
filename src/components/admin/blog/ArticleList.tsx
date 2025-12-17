"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface Article {
    id: string;
    title: string;
    slug: string;
    published_at: string;
    author_name: string;
}

export function ArticleList() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchArticles = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setArticles(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Ești sigur că vrei să ștergi acest articol?")) return;

        const supabase = createClient();
        // Get session token for authentication
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            alert("Sesiune expirată. Te rugăm să te autentifici din nou.");
            return;
        }

        const response = await fetch(`/api/admin/articles?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            alert("Eroare la ștergere: " + (error.error || "Necunoscută"));
        } else {
            setArticles(articles.filter(a => a.id !== id));
        }
    };

    if (loading) return <div>Se încarcă articolele...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Articole Blog</h2>
                <Button asChild>
                    <Link href="/admin/blog/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Articol Nou
                    </Link>
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Titlu</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Autor</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Data Publicării</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium max-w-md truncate">
                                    {article.title}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {article.author_name}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {format(new Date(article.published_at), 'd MMM yyyy', { locale: ro })}
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <Button variant="ghost" size="icon" asChild title="Editează">
                                        <Link href={`/admin/blog/${article.id}`}>
                                            <Pencil className="h-4 w-4 text-blue-600" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" asChild title="Vezi Public">
                                        <Link href={`/articole/${article.slug}`} target="_blank">
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(article.id)}
                                        title="Șterge"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    Niciun articol găsit.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
