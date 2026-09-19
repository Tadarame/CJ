"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const router = useRouter();
  const { user, loading, refresh } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      await login(email, password);
      await refresh();
      router.push("/admin");
    } catch {
      setStatus("error");
    }
  }

  if (loading || user) {
    return null;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
          ← Voltar
        </Link>

        <h1 className="mt-6 font-display text-3xl italic sm:text-4xl">Login</h1>
        <p className="mt-4 text-muted">Acesso restrito à área administrativa.</p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-muted">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-400">Email ou senha inválidos.</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 w-fit border border-accent px-6 py-2 text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
          >
            {status === "loading" ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}