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
  onProcess,
  onRemove,
}: {
  item: Item;
  onProcess: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const meta = TYPE_META[item.type];
  const [eating, setEating] = useState(false);

  function feed() {
    setEating(true);
    setTimeout(() => onProcess(item.id), 450);
  }

  return (
    <li
      className={`rounded-2xl border border-line bg-ink p-4 ${eating ? "animate-munch" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between text-xs text-cream-dim">
        <span className="rounded-full bg-ink-2 px-2.5 py-1">
          {meta.emoji} {meta.label}
        </span>
        <span>{timeAgo(item.createdAt)}</span>
      </div>

      <p className="line-clamp-4 whitespace-pre-line break-words text-[15px] leading-relaxed">
        {item.content}
      </p>

      {item.summary && (
        <p className="mt-3 rounded-xl bg-coal/60 p-3 text-sm leading-relaxed text-cream-dim">
          {item.summary}
        </p>
      )}

      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span key={t} className="rounded-full bg-eye/15 px-2.5 py-0.5 text-xs text-eye">
              #{t}
            </span>
          ))}
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
        {item.status === "inbox" && (
          <button
            type="button"
            onClick={feed}
            disabled={eating}
            className="rounded-full border border-eye/50 px-4 py-1.5 text-sm font-medium text-eye active:bg-eye/10"
          >
            Cho mèo ăn 🐟
          </button>
        )}
      </div>
    </li>
  );
}
