import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Admin from "@/models/Admin";

export async function POST(request) {
    try {
        await connectToDatabase();

        // Check if admin already exists
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            return NextResponse.json(
                { error: "Admin already exists" },
                { status: 400 },
            );
        }

        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 },
            );
        }

        const admin = new Admin({
            username,
            email,
            password,
        });

        await admin.save();

        return NextResponse.json(
            { message: "Admin created successfully" },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json(
            { error: "Failed to create admin" },
            { status: 500 },
        );
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const adminExists = await Admin.findOne();

        return NextResponse.json({ hasAdmin: !!adminExists });
    } catch (error) {
        console.error("Error checking admin:", error);
        return NextResponse.json(
            { error: "Failed to check admin status" },
            { status: 500 },
        );
    }
}
