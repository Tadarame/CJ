"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/AuthContext";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, loading, logout } = useAuth();

  return (
    <nav className="relative flex items-center text-sm text-muted">
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden"
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className="hidden items-center gap-6 sm:flex">
        <Link
          href="/portfolio"
          className="transition-colors hover:text-foreground"
        >
          Portfólio
        </Link>

        <Link href="/sobre" className="transition-colors hover:text-foreground">
          Sobre
        </Link>

        <Link
          href="/contato"
          className="transition-colors hover:text-foreground"
        >
          Contato
        </Link>

        {loading ? null : user ? (
          <>
            <Link
              href="/admin"
              className="transition-colors hover:text-foreground"
            >
              Admin
            </Link>

            <button
              onClick={logout}
              className="transition-colors hover:text-foreground"
            >
              Sair
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="transition-colors hover:text-foreground"
          >
            Login
          </Link>
        )}
      </div>
      {menuOpen && (
        <div className="absolute right-0 top-full flex min-w-48 flex-col gap-4 border-b border-border/60 bg-background px-6 py-4 shadow-lg sm:hidden">
          <Link
            href="/portfolio"
            onClick={() => setMenuOpen(false)}
            className="transition-colors hover:text-foreground"
          >
            Portfólio
          </Link>

          <Link
            href="/sobre"
            onClick={() => setMenuOpen(false)}
            className="transition-colors hover:text-foreground"
          >
            Sobre
          </Link>

          <Link
            href="/contato"
            onClick={() => setMenuOpen(false)}
            className="transition-colors hover:text-foreground"
          >
            Contato
          </Link>

          {loading ? null : user ? (
            <>
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="transition-colors hover:text-foreground"
              >
                Admin
              </Link>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-left transition-colors hover:text-foreground"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-left transition-colors hover:text-foreground"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
