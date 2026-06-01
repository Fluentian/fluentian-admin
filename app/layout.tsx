import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Outfit } from "next/font/google";
import type { Metadata } from "next";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Fluentian Admin | Premium Dashboard",
  description: "Management dashboard for content creators and teachers to build interactive language courses",
  keywords: ["language learning", "admin dashboard", "education", "courses"],
  authors: [{ name: "Fluentian" }],
  creator: "Fluentian",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://admin.fluentian.com",
    title: "Fluentian Admin | Premium Dashboard",
    description: "Management dashboard for content creators and teachers to build interactive language courses",
    siteName: "Fluentian Admin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluentian Admin | Premium Dashboard",
    description: "Management dashboard for content creators and teachers to build interactive language courses",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans antialiased text-slate-900">
        <ErrorBoundary>
          <Providers>
            {children}
            <Toaster position="top-right" expand={false} richColors />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
