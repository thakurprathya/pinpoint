import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import "./globals.css";
import Footer from '../components/Footer';
import Header from '../components/Header';

export const metadata: Metadata = {
    title: "PinPoint",
    description: "Your bookmark manager",
    icons: {
        icon: "/favicon.svg",
        shortcut: "/favicon.svg",
        apple: "/favicon.svg",
        other: {
            rel: "mask-icon",
            url: "/favicon.svg",
            color: "#F0BB78"
        }
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <head>
                    <link rel="icon" href="/favicon.svg" type="image/svg+xml" color='#F0BB78' />
                    <link rel="mask-icon" href="/favicon.svg" color="#F0BB78" />
                </head>
                <body>
                    <Header />
                    {children}
                    <Footer />
                </body>
            </html>
        </ClerkProvider>
    );
}
