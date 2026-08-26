import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CocadaJak - Portfólio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
          <Link href="/portfolio">Portfólio</Link>
          <Link href="/contato">Contato</Link>
          <Link href="/login">Login</Link>
        </header>
        <main style={{ padding: "1rem" }}>{children}</main>
      </body>
    </html>
  );
}