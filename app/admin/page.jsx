"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavigationHeader from "@/components/NavigationHeader";
import PostCard from "@/components/PostCard";

export default function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session?.user) {
            router.push("/admin/login");
            return;
        }

        fetchPosts();
    }, [session, status, router]);

    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/posts?admin=true");
            if (!response.ok) throw new Error("Failed to fetch posts");

            const data = await response.json();
            setPosts(data.posts || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (post) => {
        router.push(`/admin/edit/${post.slug}`);
    };

    const handleDelete = async (post) => {
        if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/posts/${post.slug}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete post");

            setPosts(posts.filter((p) => p._id !== post._id));
        } catch (err) {
            alert("Error deleting post: " + err.message);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <NavigationHeader isAdmin />
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="glass rounded-2xl p-8 shadow-soft"
                            >
                                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
            <NavigationHeader isAdmin />

            <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-blue-700 bg-clip-text text-transparent mb-1">
                            Content Dashboard
                        </h1>
                        <p className="text-gray-500 text-base sm:text-lg">
                            Manage your blog posts and content
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/admin/create")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-150"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <span className="hidden sm:inline">
                            Create New Post
                        </span>
                        <span className="sm:hidden">New</span>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 shadow">
                        Error: {error}
                    </div>
                )}

                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <svg
                                className="w-10 h-10 text-primary-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                            No posts created yet
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md text-center">
                            Get started by creating your first blog post and
                            sharing your thoughts with the world.
                        </p>
                        <button
                            onClick={() => router.push("/admin/create")}
                            className="px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold shadow hover:bg-primary-700 transition"
                        >
                            Create First Post
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="transition-transform hover:-translate-y-1"
                            >
                                <PostCard
                                    post={post}
                                    showActions={true}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
