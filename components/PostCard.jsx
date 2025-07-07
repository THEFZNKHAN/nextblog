"use client";

import Link from "next/link";

export default function PostCard({
    post,
    showActions = false,
    onEdit,
    onDelete,
}) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <article className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 overflow-hidden border border-white/50 hover:border-primary-200 animate-fade-in">
            <div className="p-8">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <Link href={`/posts/${post.slug}`}>
                            <h2 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer mb-3 group-hover:text-primary-600 leading-tight">
                                {post.title}
                            </h2>
                        </Link>

                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <time className="text-sm text-gray-500 font-medium">
                                    {formatDate(post.createdAt)}
                                </time>
                                {!post.published && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                        Draft
                                    </span>
                                )}
                            </div>

                            <Link
                                href={`/posts/${post.slug}`}
                                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors group-hover:translate-x-1 transform duration-300"
                            >
                                Read more
                                <svg
                                    className="ml-1 w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {showActions && (
                    <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-4">
                        <button
                            onClick={() => onEdit(post)}
                            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors"
                        >
                            <svg
                                className="mr-1 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(post)}
                            className="inline-flex items-center text-danger-600 hover:text-danger-700 font-semibold text-sm transition-colors"
                        >
                            <svg
                                className="mr-1 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}
