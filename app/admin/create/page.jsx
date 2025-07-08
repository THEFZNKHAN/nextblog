"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavigationHeader from "@/components/NavigationHeader";
import PostEditor from "@/components/PostEditor";

export default function CreatePost() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create post");
            }

            const { post } = await response.json();

            // Redirect to post page if published, otherwise to dashboard
            if (formData.published) {
                router.replace(`/posts/${post.slug}`);
            } else {
                router.replace("/admin");
            }
        } catch (error) {
            alert("Error creating post: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <NavigationHeader isAdmin />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary-500 mb-2">
                        Create New Post
                    </h1>
                    <p className="text-gray-600">
                        Write and publish a new blog post
                    </p>
                </div>

                <PostEditor onSubmit={handleSubmit} isLoading={isSubmitting} />
            </main>
        </div>
    );
}
