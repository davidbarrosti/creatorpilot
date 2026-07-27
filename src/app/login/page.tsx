"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="text-2xl font-bold">Entrar no CreatorPilot</h1>

      {status === "sent" ? (
        <p className="text-slate-600">
          Link mágico enviado para <strong>{email}</strong>. Confira sua caixa de entrada.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-3"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {status === "sending" ? "Enviando..." : "Enviar link mágico"}
          </button>
          {status === "error" && (
            <p className="text-sm text-red-600">Não deu pra enviar o link. Tenta de novo.</p>
          )}
        </form>
      )}
    </main>
  );
}
