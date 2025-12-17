import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Service Role Client
// This client bypasses Row Level Security (RLS)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, slug, content, excerpt, image_url, author_name, tags, published_at } = body;

        // Basic validation
        if (!title || !slug || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('articles')
            .insert([{
                title,
                slug,
                content,
                excerpt,
                image_url,
                author_name,
                tags,
                published_at: published_at || new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error("Supabase Article Create Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });

    } catch (error: any) {
        console.error("Server article create error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, tags, ...updates } = body;

        // Exclusivity logic for 'Recomandat' tag
        if (tags && tags.includes('Recomandat')) {
            // Remove 'Recomandat' from all other articles
            // We can't do a complex update easily with just one query without RLS issues potentially, 
            // but provided Service Role is used, we can fetch all with that tag and update them.
            // Or simpler: We fetch any article that IS 'Recomandat' and isn't THIS one.

            const { data: existingFeatured } = await supabase
                .from('articles')
                .select('id, tags')
                .contains('tags', ['Recomandat']);

            if (existingFeatured && existingFeatured.length > 0) {
                for (const art of existingFeatured) {
                    // If different article (for Update case) or just any (for Create case)
                    // For Update, we might match ourselves, so skip if id matches.
                    if (id && art.id === id) continue;

                    const newTags = (art.tags || []).filter((t: string) => t !== 'Recomandat');
                    await supabase.from('articles').update({ tags: newTags }).eq('id', art.id);
                }
            }
        }

        if (!id) {
            return NextResponse.json({ error: 'Article ID is required for update' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('articles')
            .update({
                ...updates,
                tags, // Update tags which might contain Recomandat
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Supabase Article Update Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });

    } catch (error: any) {
        console.error("Server article update error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
