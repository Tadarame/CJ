"use client";

import { useState, FormEvent } from "react";
import { sendContact } from "@/lib/api";

export default function ContatoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      await sendContact({ name, email, message });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Algo deu errado.");
    }
  }

  return (
    <div className="max-w-lg py-16 sm:py-24">
      <h1 className="font-display text-3xl italic sm:text-4xl">Contato</h1>
      <p className="mt-4 text-muted">
        Conta um pouco sobre o que você precisa — retrato, evento, ensaio — e
        eu respondo em breve.
      </p>

      {status === "sent" ? (
        <p className="mt-10 border border-border p-6 text-accent">
          Mensagem enviada com sucesso. Obrigado pelo contato!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-muted">
              Nome
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
            />
          </div>

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
            <label htmlFor="message" className="text-sm text-muted">
              Mensagem
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none border-b border-border bg-transparent py-2 outline-none focus:border-accent"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 w-fit border border-accent px-6 py-2 text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
          >
            {status === "loading" ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>
      )}
    </div>
  );
}