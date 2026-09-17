import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

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
            <nav className="flex gap-6 text-sm text-muted">
              <Link href="/portfolio" className="transition-colors hover:text-foreground">
                Portfólio
              </Link>
              <Link href="/contato" className="transition-colors hover:text-foreground">
                Contato
              </Link>
              <Link href="/login" className="transition-colors hover:text-foreground">
                Login
              </Link>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-6 sm:px-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}