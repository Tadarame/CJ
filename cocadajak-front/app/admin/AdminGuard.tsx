"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <p className="py-16 text-muted">Carregando...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="py-10">
      <nav className="mb-10 flex gap-6 border-b border-border pb-4 text-sm">
        <a href="/admin" className="text-muted hover:text-foreground">
          Início
        </a>
        <a href="/admin/eventos" className="text-muted hover:text-foreground">
          Eventos
        </a>
        <a
          href="/admin/categorias"
          className="text-muted hover:text-foreground"
        >
          Categorias
        </a>
        <a href="/admin/sobre" className="text-muted hover:text-foreground">
          Sobre
        </a>
      </nav>
      {children}
    </div>
  );
}
