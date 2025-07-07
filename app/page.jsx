import NavigationHeader from "@/components/NavigationHeader";
import PostCard from "@/components/PostCard";

async function fetchPosts() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/posts`,
            {
                cache: "no-store",
            },
        );

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        return data.posts || [];
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export default async function HomePage() {
    const posts = await fetchPosts();

    return (
        <div className="min-h-screen bg-background">
            <NavigationHeader />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary-500 mb-4">
                        Welcome to NextBlog
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover insightful articles, tutorials, and thoughts on
                        modern web development
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="mx-auto h-12 w-12"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No posts yet
                        </h3>
                        <p className="text-gray-500">
                            Check back soon for new content!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
