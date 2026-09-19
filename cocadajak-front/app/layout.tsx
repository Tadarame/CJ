import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CocadaJak — Fotografia",
  description: "Portfólio fotográfico de CocadaJak.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        <AuthProvider>
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-background/90 px-6 py-4 backdrop-blur sm:px-10">
            <Link href="/" className="font-display text-lg tracking-tight">
              CocadaJak
            </Link>
            <Nav />
          </header>
          <main className="mx-auto max-w-6xl px-6 sm:px-10">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}