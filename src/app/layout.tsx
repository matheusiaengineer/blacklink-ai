import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "BLACKLINK AI — Build Authority. Become Visible. Get Hired.",
    template: "%s · BLACKLINK AI"
  },
  description:
    "AI-powered LinkedIn growth platform. Generate viral posts, automate authority and connect with global opportunities.",
  keywords: [
    "LinkedIn AI",
    "AI content generator",
    "professional growth",
    "BLACKLINK AI",
    "personal branding",
    "AI SaaS"
  ],
  authors: [{ name: "BLACKLINK AI" }],
  openGraph: {
    type: "website",
    title: "BLACKLINK AI",
    description: "Build Authority. Become Visible. Get Hired.",
    siteName: "BLACKLINK AI"
  },
  twitter: {
    card: "summary_large_image",
    title: "BLACKLINK AI",
    description: "Build Authority. Become Visible. Get Hired."
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} dark`}>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
