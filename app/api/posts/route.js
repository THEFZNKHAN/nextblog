import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import BlogPost from "@/models/BlogPost";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const includeUnpublished = searchParams.get("admin") === "true";

        const query = {};

        // Only show unpublished posts to authenticated admins
        if (!includeUnpublished || !session?.user) {
            query.published = true;
        }

        const posts = await BlogPost.find(query)
            .sort({ createdAt: -1 })
            .select("title slug excerpt createdAt updatedAt published");

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 },
        );
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        await connectToDatabase();

        const body = await request.json();
        const { title, content, published = true } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 },
            );
        }

        const newPost = new BlogPost({
            title,
            content,
            published,
        });

        await newPost.save();

        return NextResponse.json({ post: newPost }, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);

        if (error.code === 11000) {
            return NextResponse.json(
                { error: "A post with this title already exists" },
                { status: 409 },
            );
        }

        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 },
        );
    }
}
