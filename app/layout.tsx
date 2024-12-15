import { ClerkProvider } from '@clerk/nextjs';
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

const clerkTheme = {
    layout: {
        socialButtonsPlacement: "bottom",
        socialButtonsVariant: "iconButton",
    },
    elements: {
        // Modal and root styling
        root: "bg-[#2D1810]",
        card: "bg-[#2D1810] shadow-xl",
        modalContent: "flex items-center justify-center min-h-screen",
        modal: "bg-[#2D1810] rounded-xl",
        modalCloseButton: "!border-none !shadow-none !outline-none hover:!bg-transparent text-[#F0BB78]",
        closeButton: "!border-none !shadow-none !outline-none hover:!bg-transparent text-[#F0BB78]",

        // Text and header elements
        headerTitle: "text-[#F0BB78]",
        headerSubtitle: "text-[#F0BB78]",
        dividerText: "text-[#F0BB78]",
        dividerLine: "bg-[#F0BB78]",

        // Form elements
        formButtonPrimary: "bg-[#F0BB78] hover:bg-[#d4a469] text-[#2D1810]",
        formButtonReset: "text-[#F0BB78] hover:text-[#d4a469]",
        formField: "text-[#F0BB78]",
        formFieldLabel: "text-[#F0BB78]",
        formFieldInput: "bg-[#543A14] text-[#F0BB78] border-[#F0BB78]",
        formFieldSuccessText: "text-[#F0BB78]",
        formFieldErrorText: "text-red-400",
        formResendCodeLink: "text-[#F0BB78]",

        // Input fields
        otpCodeFieldInput: "bg-[#543A14] text-[#F0BB78] border-[#F0BB78]",
        phoneInputBox: "bg-[#543A14] text-[#F0BB78] border-[#F0BB78]",

        // Social buttons
        socialButtonsIconButton: "bg-[#FFF0DC] hover:bg-[#F0BB78] text-[#F0BB78]",
        socialButtonsProvider: "text-[#2D1810]",
        socialButtonsProviderIcon: "[&_svg]:fill-[#2D1810]",

        // User button and dropdown
        userButtonPopoverCard: "!bg-[#2D1810] border border-[#543A14] shadow-lg",
        userButtonPopover: "!bg-[#2D1810]",
        userButtonPopoverActions: "!bg-[#2D1810] text-[#F0BB78]",
        userButtonPopoverActionButton: "hover:!bg-[#543A14] text-[#F0BB78]",
        userButtonPopoverFooter: "!bg-[#2D1810] border-t border-[#F0BB78]",
        userButtonPopoverActionButtonIcon: "[&_svg]:fill-[#F0BB78]",
        userButtonPopoverActionButtonText: "text-[#F0BB78]",

        // Profile elements
        userProfileSection: "!bg-[#2D1810] text-[#F0BB78]",
        userPreviewMainIdentifier: "text-[#F0BB78]",
        userPreviewSecondaryIdentifier: "text-[#F0BB78] opacity-80",

        // Navigation elements
        menuButton: "text-[#F0BB78]",
        navbarButton: "text-[#F0BB78]",
        selectButton: "text-[#F0BB78]",
        selectOptionText: "text-[#F0BB78]",

        // Action elements
        signOutButton: "text-[#F0BB78] hover:!bg-[#543A14]",
        identityPreviewText: "text-[#F0BB78]",
        identityPreviewEditButton: "text-[#F0BB78]",
        alternativeMethodsBlockButton: "bg-white hover:bg-[#F0BB78] text-[#F0BB78]",
        footerActionLink: "[&_svg]:fill-[#F0BB78]",
        logoBox: "text-[#F0BB78]",

        // Avatar styling
        avatarBox: "h-10 w-10 rounded-full border-none [&_svg]:fill-[#F0BB78]",
        userButtonAvatarBox: "h-10 w-10 rounded-full border-2 border-[#F0BB78]",
        userButtonTrigger: "focus:shadow-none hover:opacity-80",

        // Preview styling
        userPreviewAvatarBox: "border-2 border-[#F0BB78]",
        userPreviewAvatarImage: "rounded-full",

        // Badge elements
        badge: "bg-[#FFF0DC] text-[#2D1810] rounded",
        badgePrimary: "bg-[#FFF0DC] text-[#2D1810]",
        badgeSecondary: "bg-[#FFF0DC] text-[#2D1810] opacity-80",
    },
    variables: {
        colorBackground: "#2D1810",
        colorPrimary: "#F0BB78",
        colorText: "#F0BB78",
        colorInputBackground: "#543A14",
        colorInputText: "#F0BB78",
        colorTextSecondary: "#F0BB78",
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                elements: { ...clerkTheme.elements },
                variables: { ...clerkTheme.variables },
            }}
        >
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
