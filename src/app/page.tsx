"use client";

import { useEffect, useMemo, useState } from "react";
import { CatFace, SleepingCat } from "@/components/Cat";
import { CaptureBar } from "@/components/CaptureBar";
import { ItemCard } from "@/components/ItemCard";
import { LoginForm } from "@/components/LoginForm";
import { useSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useItems } from "@/lib/store";

type Filter = "inbox" | "processed" | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "inbox", label: "Bát thức ăn" },
  { key: "processed", label: "Đã tiêu hoá" },
  { key: "all", label: "Tất cả" },
];

function Brain() {
  const { items, ready, error, add, process: processItem, remove } = useItems();
  const [filter, setFilter] = useState<Filter>("inbox");
  const [topic, setTopic] = useState<string | null>(null);

  // Đăng ký service worker để cài được như app.
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      navigator.serviceWorker.register(`${base}/sw.js`).catch(() => {});
    }
  }, []);

  const inboxCount = items.filter((i) => i.status === "inbox").length;
  const visible = useMemo(() => {
    const byStatus = filter === "all" ? items : items.filter((i) => i.status === filter);
    // Lọc theo chủ đề: khớp lĩnh vực hoặc một trong các tag.
    return topic ? byStatus.filter((i) => i.domain === topic || i.tags.includes(topic)) : byStatus;
  }, [items, filter, topic]);

  // Bấm lại cùng chủ đề thì bỏ lọc; chuyển sang "Tất cả" để thấy toàn bộ kho kiến thức.
  function pickTopic(t: string) {
    setTopic((cur) => (cur === t ? null : t));
    setFilter("all");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-5 px-4 pb-16 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <CatFace size={44} />
        <div>
          <h1 className="text-2xl font-bold leading-none tracking-tight">
            Cat<span className="text-eye">.</span>Me
          </h1>
          <p className="mt-1 text-xs text-cream-dim">Second brain, mèo canh giữ</p>
        </div>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="ml-auto rounded-full px-3 py-1.5 text-xs text-cream-dim/70 active:bg-ink-2"
        >
          Đăng xuất
        </button>
      </header>

      <CaptureBar onAdd={add} />

      {error && (
        <p role="alert" className="rounded-2xl border border-nose/40 bg-nose/10 p-3 text-sm text-nose">
          {error}
        </p>
      )}

      <nav className="flex gap-2" aria-label="Bộ lọc">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`rounded-full px-4 py-2 text-sm transition ${
                active ? "bg-cream text-coal font-semibold" : "bg-ink text-cream-dim"
              }`}
            >
              {f.label}
              {f.key === "inbox" && inboxCount > 0 && (
                <span className="ml-1.5 rounded-full bg-eye px-1.5 py-0.5 text-[11px] font-bold text-coal">
                  {inboxCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {topic && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-cream-dim">Đang xem chủ đề</span>
          <button
            type="button"
            onClick={() => setTopic(null)}
            className="rounded-full bg-eye px-3 py-1 font-semibold text-coal active:scale-95"
          >
            {topic} ✕
          </button>
        </div>
      )}

      {!ready ? null : visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
          <SleepingCat className="animate-breathe" />
          <p className="font-medium">
            {filter === "inbox" ? "Bát trống rồi, mèo đang ngủ" : "Chưa có gì ở đây"}
          </p>
          <p className="max-w-64 text-sm text-cream-dim">
            Ném gì đó vào ô phía trên, mèo sẽ lo phần còn lại. Đừng đánh thức mèo nếu không có gì ăn.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              activeTopic={topic}
              onProcess={processItem}
              onRemove={remove}
              onTopic={pickTopic}
            />
          ))}
        </ul>
      )}
    </main>
  );
}

export default function Home() {
  const { session, loading } = useSession();
  if (loading) return <main className="min-h-dvh" aria-busy="true" />;
  if (!session) return <LoginForm />;
  // key theo user để dữ liệu không lẫn khi đổi tài khoản
  return <Brain key={session.user.id} />;
}
