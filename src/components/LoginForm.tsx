"use client";

import { useState } from "react";
import { CatFace } from "./Cat";
import { supabase } from "@/lib/supabase";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError("Sai email hoặc mật khẩu. Mèo không cho vào.");
    setBusy(false);
  }

  const field =
    "w-full rounded-2xl border border-line bg-ink px-4 py-3 text-base text-cream placeholder:text-cream-dim/60 focus:border-eye/60 focus:outline-none";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-6 px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <CatFace size={96} />
        <h1 className="text-3xl font-bold tracking-tight">
          Cat<span className="text-eye">.</span>Me
        </h1>
        <p className="text-sm text-cream-dim">Chỉ chủ nhân mới được vào.</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={field}
        />
        <label className="sr-only" htmlFor="password">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          className={field}
        />
        {error && (
          <p role="alert" className="px-1 text-sm text-nose">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-eye py-3 text-base font-semibold text-coal transition active:scale-95 disabled:opacity-60"
        >
          {busy ? "Đang mở cửa…" : "Vào nhà 🐾"}
        </button>
      </form>
    </main>
  );
}
