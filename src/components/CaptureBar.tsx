"use client";

import { useEffect, useRef, useState } from "react";

/** Ô nhập duy nhất: dán link, gõ ghi chú, chia sẻ từ điện thoại. */
export function CaptureBar({ onAdd }: { onAdd: (content: string) => void }) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  // Share Target (PWA): trình duyệt mở app với ?title=&text=&url=
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const shared = [p.get("title"), p.get("text"), p.get("url")].filter(Boolean).join("\n");
    if (shared) {
      setValue(shared);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  function submit() {
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
    ref.current?.focus();
  }

  return (
    <div className="rounded-3xl border border-line bg-ink p-3 shadow-lg shadow-black/30 focus-within:border-eye/60">
      <label htmlFor="capture" className="sr-only">
        Ghi nhanh
      </label>
      <textarea
        id="capture"
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
        }}
        rows={3}
        placeholder="Dán link, gõ ghi chú, ý tưởng, trích dẫn sách…"
        className="w-full resize-none bg-transparent px-2 py-1 text-base text-cream placeholder:text-cream-dim/60 focus:outline-none"
      />
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="px-2 text-xs text-cream-dim/70">Tự nhận diện link</span>
        <button
          type="button"
          onClick={submit}
          disabled={!value.trim()}
          className="shrink-0 whitespace-nowrap rounded-full bg-eye px-5 py-2 text-sm font-semibold text-coal transition active:scale-95 disabled:bg-ink-2 disabled:text-cream-dim/50"
        >
          Thả vào bát 🐾
        </button>
      </div>
    </div>
  );
}
