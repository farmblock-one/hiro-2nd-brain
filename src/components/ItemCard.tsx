"use client";

import { useState } from "react";
import { TYPE_META, type Item } from "@/lib/types";

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  return `${Math.round(hrs / 24)} ngày trước`;
}

export function ItemCard({
  item,
  activeTopic,
  onProcess,
  onRemove,
  onTopic,
}: {
  item: Item;
  activeTopic: string | null;
  onProcess: (id: string) => Promise<boolean>;
  onRemove: (id: string) => void;
  onTopic: (topic: string) => void;
}) {
  const meta = TYPE_META[item.type];
  const [eating, setEating] = useState(false);
  const [open, setOpen] = useState(false);

  async function feed() {
    setEating(true);
    await onProcess(item.id);
    setEating(false);
  }

  const hasDetail =
    item.keyPoints.length > 0 || item.quotes.length > 0 || item.actionItems.length > 0;
  // Mục chưa có bản tóm tắt đầy đủ (kể cả mục cũ) thì cho phép nhờ mèo đọc (lại).
  const canFeed = item.status === "inbox" || item.keyPoints.length === 0;

  const chip = (topic: string, label: string, accent: boolean) => (
    <button
      key={`${accent ? "d" : "t"}-${topic}`}
      type="button"
      onClick={() => onTopic(topic)}
      aria-pressed={activeTopic === topic}
      className={`rounded-full px-2.5 py-0.5 text-xs transition active:scale-95 ${
        activeTopic === topic
          ? "bg-eye text-coal font-semibold"
          : accent
            ? "bg-eye/15 text-eye"
            : "bg-ink-2 text-cream-dim"
      }`}
    >
      {label}
    </button>
  );

  return (
    <li className={`rounded-2xl border border-line bg-ink p-4 ${eating ? "animate-pulse" : ""}`}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-cream-dim">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-ink-2 px-2.5 py-1">
            {meta.emoji} {meta.label}
          </span>
          {item.domain && chip(item.domain, item.domain, true)}
        </div>
        <span>{timeAgo(item.createdAt)}</span>
      </div>

      {item.title && <h2 className="mb-1 text-base font-semibold leading-snug">{item.title}</h2>}

      <p
        className={`whitespace-pre-line break-words text-[15px] leading-relaxed ${
          item.summary ? "text-cream-dim" : ""
        } ${item.title ? "line-clamp-2 text-sm" : "line-clamp-4"}`}
      >
        {item.content}
      </p>

      {item.summary && (
        <p className="mt-3 rounded-xl bg-coal/60 p-3 text-sm leading-relaxed">{item.summary}</p>
      )}

      {hasDetail && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="text-sm font-medium text-eye"
          >
            {open ? "Thu gọn ▲" : `Xem ý chính (${item.keyPoints.length}) ▼`}
          </button>

          {open && (
            <div className="mt-3 flex flex-col gap-4">
              {item.keyPoints.length > 0 && (
                <ol className="flex list-decimal flex-col gap-3 pl-5 marker:text-eye">
                  {item.keyPoints.map((k, i) => (
                    <li key={i} className="text-sm leading-relaxed">
                      <strong className="font-semibold">{k.heading}</strong>
                      {k.heading && k.detail ? ": " : ""}
                      <span className="text-cream-dim">{k.detail}</span>
                    </li>
                  ))}
                </ol>
              )}

              {item.quotes.length > 0 && (
                <section aria-label="Trích dẫn">
                  <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cream-dim">
                    Trích dẫn
                  </h3>
                  {item.quotes.map((q, i) => (
                    <blockquote
                      key={i}
                      className="mb-2 border-l-2 border-eye/60 pl-3 text-sm italic leading-relaxed"
                    >
                      {q}
                    </blockquote>
                  ))}
                </section>
              )}

              {item.actionItems.length > 0 && (
                <section aria-label="Việc có thể làm">
                  <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cream-dim">
                    Việc có thể làm
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {item.actionItems.map((a, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed">
                        <span aria-hidden className="text-nose">
                          🐾
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      )}

      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((t) => chip(t, `#${t}`, false))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="rounded-full px-3 py-1.5 text-xs text-cream-dim/70 active:bg-ink-2"
        >
          Xoá
        </button>
        {canFeed && (
          <button
            type="button"
            onClick={feed}
            disabled={eating}
            className="rounded-full border border-eye/50 px-4 py-1.5 text-sm font-medium text-eye active:bg-eye/10 disabled:opacity-70"
          >
            {eating
              ? "Mèo đang nhai…"
              : item.status === "inbox"
                ? "Cho mèo ăn 🐟"
                : "Nhờ mèo đọc lại 🐟"}
          </button>
        )}
      </div>
    </li>
  );
}
