import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "NextBlog - Modern Blog Platform",
    description:
        "A beautiful, modern blog platform built with Next.js and MongoDB",
    keywords: "blog, next.js, mongodb, modern, articles, posts",
    author: ["thefznkhan", "Md Faizan Khan"],
    openGraph: {
        title: "NextBlog - Modern Blog Platform",
        description:
            "A beautiful, modern blog platform built with Next.js and MongoDB",
        type: "website",
        // url: "",
        // image: "",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content={metadata.keywords} />
                <meta name="author" content={metadata.author} />
                {/* Open Graph */}
                <meta property="og:title" content={metadata.openGraph.title} />
                <meta
                    property="og:description"
                    content={metadata.openGraph.description}
                />
                <meta property="og:type" content={metadata.openGraph.type} />
                <meta property="og:url" content={metadata.openGraph.url} />
                <meta property="og:image" content={metadata.openGraph.image} />
                <title>{metadata.title}</title>
            </head>
            <body
                className={`${inter.className} bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen antialiased`}
            >
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
