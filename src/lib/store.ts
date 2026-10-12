"use client";

import { useCallback, useEffect, useState } from "react";
import { detectType, extractUrl } from "./detect";
import type { Item } from "./types";

/**
 * Giai đoạn 1: lưu tạm trong localStorage để chạy được ngay.
 * Giai đoạn 2 sẽ thay phần đọc/ghi bằng Supabase mà giữ nguyên giao diện hook.
 */
const KEY = "catme.items.v1";

const SEED: Item[] = [
  {
    id: "seed-1",
    type: "book",
    content: "Atomic Habits — thói quen nhỏ, thay đổi lớn nhờ hệ thống chứ không phải mục tiêu.",
    status: "processed",
    summary: "Cải thiện 1% mỗi ngày. Tập trung vào danh tính và hệ thống thay vì mục tiêu.",
    tags: ["thói quen", "phát triển bản thân"],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "seed-2",
    type: "video",
    content: "https://youtu.be/dQw4w9WgXcQ",
    sourceUrl: "https://youtu.be/dQw4w9WgXcQ",
    status: "inbox",
    tags: [],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

function load(): Item[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Item[];
  } catch {
    /* localStorage không dùng được → rơi về dữ liệu mẫu */
  }
  return SEED;
}

function save(items: Item[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* bỏ qua */
  }
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
  }, []);

  const update = useCallback((fn: (prev: Item[]) => Item[]) => {
    setItems((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const add = useCallback(
    (content: string) => {
      const text = content.trim();
      if (!text) return;
      const item: Item = {
        id: crypto.randomUUID(),
        type: detectType(text),
        content: text,
        sourceUrl: extractUrl(text),
        status: "inbox",
        tags: [],
        createdAt: new Date().toISOString(),
      };
      update((prev) => [item, ...prev]);
    },
    [update],
  );

  /** "Cho mèo ăn": giai đoạn 3 sẽ gọi Claude để tóm tắt và gắn tag thật. */
  const process = useCallback(
    (id: string) => {
      update((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                status: "processed",
                summary: it.summary ?? "(Bản tóm tắt AI sẽ xuất hiện ở đây sau giai đoạn 3.)",
              }
            : it,
        ),
      );
    },
    [update],
  );

  const remove = useCallback(
    (id: string) => update((prev) => prev.filter((it) => it.id !== id)),
    [update],
  );

  return { items, ready, add, process, remove };
}
