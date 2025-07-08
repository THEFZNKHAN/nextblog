"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasAdmin, setHasAdmin] = useState(null);
    const router = useRouter();

    useEffect(() => {
        checkSession();
        checkAdminExists();
    }, []);

    const checkSession = async () => {
        const session = await getSession();
        if (session?.user) {
            router.push("/admin");
        }
    };

    const checkAdminExists = async () => {
        try {
            const response = await fetch("/api/admin/setup");
            const data = await response.json();
            setHasAdmin(data.hasAdmin);
        } catch (error) {
            console.error("Error checking admin:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                username: credentials.username,
                password: credentials.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid credentials");
            } else {
                router.push("/admin");
            }
        } catch (error) {
            setError("An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    if (hasAdmin === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!hasAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="glass rounded-2xl shadow-large p-8 border border-white/50">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-xl">
                                    BC
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Setup Required
                            </h2>
                            <p className="text-gray-600">
                                No admin account found. Please set up your admin
                                account first.
                            </p>
                        </div>

                        <Link
                            href="/admin/setup"
                            className="btn-primary w-full text-center block"
                        >
                            Setup Admin Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="glass rounded-2xl shadow-large p-8 border border-white/50 animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-xl">
                                BC
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600">
                            Sign in to your admin dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Username or Email
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={credentials.username}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                                placeholder="Enter your username or email"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            ← Back to Blog
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
