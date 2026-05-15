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

const SITE_URL =
  process.env.NEXTAUTH_URL ?? "https://shopforge-three.vercel.app";
const SITE_DESC =
  "Plataforma de e-commerce fullstack moderna com os melhores produtos, qualidade garantida e os melhores preços do mercado.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ShopForge", template: "%s | ShopForge" },
  description: SITE_DESC,
  keywords: ["loja", "e-commerce", "compras", "online", "moda", "roupas", "eletrônicos", "acessórios"],
  authors: [{ name: "ShopForge" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "ShopForge",
    title: "ShopForge — A Melhor Loja Online",
    description: SITE_DESC,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ShopForge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopForge — A Melhor Loja Online",
    description: SITE_DESC,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.ico",
  },
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
