import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import BlogPost from "@/models/BlogPost";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const isAdminRequest = searchParams.get("admin") === "true";

        const query = { slug: params.slug };

        // Only show unpublished posts to authenticated admins
        if (!isAdminRequest || !session?.user) {
            query.published = true;
        }

        const post = await BlogPost.findOne(query);

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            { error: "Failed to fetch post" },
            { status: 500 },
        );
    }
}

export async function PUT(request, { params }) {
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
        const { title, content, published } = body;

        const updatedPost = await BlogPost.findOneAndUpdate(
            { slug: params.slug },
            { title, content, published },
            { new: true, runValidators: true },
        );

        if (!updatedPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ post: updatedPost });
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { error: "Failed to update post" },
            { status: 500 },
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        await connectToDatabase();

        const deletedPost = await BlogPost.findOneAndDelete({
            slug: params.slug,
        });

        if (!deletedPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: "Failed to delete post" },
            { status: 500 },
        );
    }
}
