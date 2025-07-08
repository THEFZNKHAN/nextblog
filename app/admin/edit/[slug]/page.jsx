"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavigationHeader from "@/components/NavigationHeader";
import PostEditor from "@/components/PostEditor";

export default function EditPost({ params }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session?.user) {
            router.push("/admin/login");
            return;
        }

        fetchPost();
    }, [params.slug, session, status, router]);

    const fetchPost = async () => {
        try {
            const response = await fetch(
                `/api/posts/${params.slug}?admin=true`,
            );

            if (!response.ok) {
                throw new Error("Post not found");
            }

            const data = await response.json();
            setPost(data.post);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/posts/${params.slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update post");
            }

            const { post: updatedPost } = await response.json();

            // Redirect to the updated post or admin dashboard
            if (updatedPost.published) {
                router.push(`/posts/${updatedPost.slug}`);
            } else {
                router.push("/admin");
            }
        } catch (error) {
            alert("Error updating post: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <NavigationHeader isAdmin />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return null;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <NavigationHeader isAdmin />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-6 py-4 rounded-xl">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <NavigationHeader isAdmin />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
                        Edit Post
                    </h1>
                    <p className="text-gray-600">
                        Make changes to "{post?.title}"
                    </p>
                </div>

                <PostEditor
                    initialData={post}
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                />
            </main>
        </div>
    );
}
