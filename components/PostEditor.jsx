"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import slugify from "slugify";

const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => (
        <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
    ),
});

import "react-quill/dist/quill.snow.css";

const editorModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
    ],
};

const editorFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
];

export default function PostEditor({
    initialData = {},
    onSubmit,
    isLoading = false,
}) {
    const [formData, setFormData] = useState({
        title: initialData.title || "",
        content: initialData.content || "",
        published:
            initialData.published !== undefined ? initialData.published : true,
    });

    const [slugPreview, setSlugPreview] = useState("");

    // Update slug preview when title changes
    useEffect(() => {
        if (formData.title) {
            const generatedSlug = slugify(formData.title, {
                lower: true,
                strict: true,
                remove: /[*+~.()'"!:@]/g,
            });
            setSlugPreview(generatedSlug);
        } else {
            setSlugPreview("");
        }
    }, [formData.title]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            alert("Please fill in both title and content");
            return;
        }

        onSubmit(formData);
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Post Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Enter your post title..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-lg"
                        disabled={isLoading}
                    />
                </div>

                {slugPreview && (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            URL Slug (auto-generated)
                        </label>
                        <code className="text-primary-600 font-mono text-sm">
                            /posts/{slugPreview}
                        </code>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Content
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <ReactQuill
                            value={formData.content}
                            onChange={(content) =>
                                updateField("content", content)
                            }
                            modules={editorModules}
                            formats={editorFormats}
                            placeholder="Start writing your post..."
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        id="published"
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) =>
                            updateField("published", e.target.checked)
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        disabled={isLoading}
                    />
                    <label
                        htmlFor="published"
                        className="ml-2 block text-sm text-gray-700"
                    >
                        Publish immediately
                    </label>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-accent-500 text-white px-8 py-3 rounded-lg hover:bg-accent-600 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Saving..." : "Save Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}
