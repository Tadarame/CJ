"use client";

import { useAuth } from "@/lib/AuthContext";

export default function AdminHome() {
  const { user, logout } = useAuth();

  return (
    <div className="py-16">
      <h1 className="font-display text-3xl italic">Painel administrativo</h1>
      <p className="mt-4 text-muted">Logado como {user?.name}</p>
      <button
        onClick={logout}
        className="mt-6 border border-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
      >
        Sair
      </button>
    </div>
  );
}