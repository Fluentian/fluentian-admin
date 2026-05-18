import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";
import { Outfit } from "next/font/google";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Fluentian Admin | Premium Dashboard",
  description: "Management dashboard for content creators and teachers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans antialiased text-slate-900">
        <Providers>
          {children}
          <Toaster position="top-right" expand={false} richColors />
        </Providers>
      </body>
    </html>
  );
}
