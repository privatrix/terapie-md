"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Save, ImagePlus, X } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { Toggle } from "@/components/ui/toggle";

interface ArticleEditorProps {
    articleId?: string; // If present, we are in Edit mode
}

export function ArticleEditor({ articleId }: ArticleEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(!!articleId);

    // Form State
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState(""); // Markdown content
    const [imageUrl, setImageUrl] = useState("");
    const [tags, setTags] = useState("");
    const [authorName, setAuthorName] = useState("Echipa Terapie.md");
    const [isFeatured, setIsFeatured] = useState(false);

    // Fetch existing article if editing
    useEffect(() => {
        if (!articleId) return;

        const fetchArticle = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', articleId)
                .single();

            if (error) {
                console.error("Error fetching article:", error);
                alert("Nu am putut încărca articolul.");
                router.push("/admin/blog");
            } else if (data) {
                setTitle(data.title);
                setSlug(data.slug);
                setExcerpt(data.excerpt || "");
                setContent(data.content);
                setImageUrl(data.image_url || "");
                const tagsList = data.tags || [];
                setTags(tagsList.join(", "));
                setIsFeatured(tagsList.includes("Recomandat"));
                setAuthorName(data.author_name || "Echipa Terapie.md");
            }
            setFetching(false);
        };

        fetchArticle();
    }, [articleId, router]);

    // Auto-generate slug from title if slug is empty (or untouched)
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Only auto-generate slug if we are creating a new article or if slug matches the old title format roughly
        if (!articleId && !slug) {
            setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    const handleSave = async () => {
        if (!title || !slug || !content) {
            alert("Titlul, URL-ul și Conținutul sunt obligatorii.");
            return;
        }

        setLoading(true);
        const supabase = createClient();

        const currentTags = tags.split(",").map(t => t.trim()).filter(Boolean);
        if (isFeatured && !currentTags.includes("Recomandat")) {
            currentTags.push("Recomandat");
        } else if (!isFeatured && currentTags.includes("Recomandat")) {
            const idx = currentTags.indexOf("Recomandat");
            if (idx > -1) currentTags.splice(idx, 1);
        }

        const articleData = {
            title,
            slug,
            excerpt,
            content,
            image_url: imageUrl,
            tags: currentTags,
            author_name: authorName,
            updated_at: new Date().toISOString(),
        };

        let error;

        // Get session for auth token
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            alert("Sesiune expirată.");
            setLoading(false);
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        };

        if (articleId) {
            // Update via API
            const response = await fetch('/api/admin/articles', {
                method: 'PUT',
                headers,
                body: JSON.stringify({ id: articleId, ...articleData }),
            });

            if (!response.ok) {
                const resData = await response.json();
                error = new Error(resData.error || 'Update failed');
            }
        } else {
            // Create via API
            const response = await fetch('/api/admin/articles', {
                method: 'POST',
                headers,
                body: JSON.stringify(articleData),
            });

            if (!response.ok) {
                const resData = await response.json();
                error = new Error(resData.error || 'Create failed');
            }
        }

        setLoading(false);

        if (error) {
            console.error("Error saving article:", error);
            alert("Eroare la salvare: " + error.message);
        } else {
            router.push("/admin/blog");
            router.refresh();
        }
    };

    if (fetching) return <div className="p-8 text-center">Se încarcă editorul...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {articleId ? "Editează Articol" : "Articol Nou"}
                </h1>
            </div>

            <div className="grid gap-6 bg-white p-6 rounded-xl border shadow-sm">

                {/* Meta Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Titlu Articol *</Label>
                        <Input
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Ex: 5 Metode să reduci stresul"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>URL Slug (unic) *</Label>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="ex: 5-metode-sa-reduci-stresul"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label>Imagine Principală</Label>

                    <div className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                            <Input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Paste URL sau încarcă o imagine..."
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={uploading}
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Se încarcă...
                                        </>
                                    ) : (
                                        <>
                                            <ImagePlus className="mr-2 h-4 w-4" />
                                            Încarcă Imagine
                                        </>
                                    )}
                                </Button>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append('file', file);

                                        setUploading(true);

                                        try {
                                            const response = await fetch('/api/upload', {
                                                method: 'POST',
                                                body: formData,
                                            });

                                            if (!response.ok) {
                                                const errorData = await response.json();
                                                throw new Error(errorData.error || 'Upload failed');
                                            }

                                            const data = await response.json();
                                            setImageUrl(data.url);
                                        } catch (error: any) {
                                            alert("Eroare la upload: " + error.message);
                                        } finally {
                                            setUploading(false);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <span className="text-xs text-muted-foreground">
                                    Suportă JPG, PNG, WEBP
                                </span>
                            </div>
                        </div>

                        {imageUrl && (
                            <div className="relative group border rounded-lg overflow-hidden shrink-0 w-32 h-24 bg-gray-50">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setImageUrl("")}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Autor</Label>
                        <Input
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Numele autorului"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tag-uri (separate prin virgulă)</Label>
                        <Input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Ex: Anxietate, Sănătate, Ghid"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 border p-4 rounded-lg bg-gray-50">
                    <Toggle
                        pressed={isFeatured}
                        onPressedChange={setIsFeatured}
                        aria-label="Toggle featured"
                        className={`data-[state=on]:bg-primary data-[state=on]:text-primary-foreground ${isFeatured ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        {isFeatured ? "ON" : "OFF"}
                    </Toggle>
                    <div className="flex flex-col">
                        <Label>Articol Recomandat</Label>
                        <span className="text-xs text-muted-foreground">
                            Activează pentru a afișa acest articol ca principal pe pagina de blog.
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Rezumat (Excerpt)</Label>
                    <Textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="O scurtă descriere ce apare în listă..."
                        className="h-20"
                    />
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                    <Label>Conținut</Label>
                    <RichTextEditor
                        value={content}
                        onChange={setContent}
                    />
                </div>

            </div>

            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => router.back()}>
                    Anulează
                </Button>
                <Button onClick={handleSave} disabled={loading} size="lg" className="min-w-[150px]">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Se salvează...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvează Articolul
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
