"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function NavigationHeader({ isAdmin = false }) {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 glass border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/logo.png"
                                    alt="NextBlog logo"
                                    fill
                                    style={{ objectFit: "contain" }}
                                    className="rounded-lg"
                                    priority
                                />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                                NextBlog
                            </span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Home
                        </Link>

                        {session?.user ? (
                            <>
                                <Link
                                    href="/admin"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/create"
                                    className="btn-accent"
                                >
                                    New Post
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href="/admin/login" className="btn-primary">
                                Admin Login
                            </Link>
                        )}
                    </nav>

                    {/* Mobile menu */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/20">
                        <div className="flex flex-col space-y-3">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                            >
                                Home
                            </Link>
                            {session?.user ? (
                                <>
                                    <Link
                                        href="/admin"
                                        className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/admin/create"
                                        className="text-accent-600 hover:text-accent-700 font-medium transition-colors"
                                    >
                                        New Post
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="text-red-600 hover:text-red-700 font-medium transition-colors text-left"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/admin/login"
                                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                >
                                    Admin Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
