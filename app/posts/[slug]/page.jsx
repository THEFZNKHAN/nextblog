import { notFound } from "next/navigation";
import NavigationHeader from "@/components/NavigationHeader";

async function fetchPost(slug) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/posts/${slug}`,
            {
                cache: "no-store",
            },
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.post;
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const post = await fetchPost(params.slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt,
        },
    };
}

export default async function PostPage({ params }) {
    const post = await fetchPost(params.slug);

    if (!post) {
        notFound();
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <NavigationHeader />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-primary-500 mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center text-gray-600">
                        <time dateTime={post.createdAt}>
                            Published on {formatDate(post.createdAt)}
                        </time>
                        {post.updatedAt !== post.createdAt && (
                            <span className="ml-4">
                                • Updated {formatDate(post.updatedAt)}
                            </span>
                        )}
                    </div>
                </header>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-primary-600 prose-links:text-accent-600 prose-strong:text-gray-900"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>
        </div>
    );
}
