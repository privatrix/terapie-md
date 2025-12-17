import { ArticleEditor } from "@/components/admin/blog/ArticleEditor";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="container py-10">
            <ArticleEditor articleId={id} />
        </div>
    );
}
