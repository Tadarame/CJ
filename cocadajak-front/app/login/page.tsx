"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const router = useRouter();
  const { refresh } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      await login(email, password);
      await refresh(); // atualiza o AuthContext com o usuário recém-logado
      router.push("/admin");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-sm py-16 sm:py-24">
      <h1 className="font-display text-3xl italic sm:text-4xl">Login</h1>
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
  );
}