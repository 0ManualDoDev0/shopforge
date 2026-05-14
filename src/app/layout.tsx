import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/shared/Providers";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import AnnouncementBar from "@/components/shared/AnnouncementBar";
import ProgressBar from "@/components/shared/ProgressBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "ShopForge", template: "%s | ShopForge" },
  description: "Plataforma de e-commerce fullstack moderna",
  keywords: ["loja", "e-commerce", "compras", "online"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          <Suspense fallback={null}>
            <AnnouncementBar />
          </Suspense>
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors position="top-right" closeButton />
        </Providers>
      </body>
    </html>
  );
}
