"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function Nav() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="flex items-center gap-6 text-sm text-muted">
      <Link href="/portfolio" className="transition-colors hover:text-foreground">
        Portfólio
      </Link>
      <Link href="/contato" className="transition-colors hover:text-foreground">
        Contato
      </Link>

      {loading ? null : user ? (
        <>
          <Link href="/admin" className="transition-colors hover:text-foreground">
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
        <Link href="/login" className="transition-colors hover:text-foreground">
          Login
        </Link>
      )}
    </nav>
  );
}