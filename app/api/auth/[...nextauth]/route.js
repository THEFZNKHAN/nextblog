import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/database";
import Admin from "@/models/Admin";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    await connectToDatabase();

                    const admin = await Admin.findOne({
                        $or: [
                            { username: credentials.username },
                            { email: credentials.username },
                        ],
                    });

                    if (!admin) {
                        return null;
                    }

                    const isPasswordValid = await admin.comparePassword(
                        credentials.password,
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: admin._id.toString(),
                        username: admin.username,
                        email: admin.email,
                        role: admin.role,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            session.user.username = token.username;
            session.user.id = token.sub;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
