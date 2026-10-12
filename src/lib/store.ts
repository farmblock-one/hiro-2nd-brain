"use client";

import { useCallback, useEffect, useState } from "react";
import { detectType, extractUrl } from "./detect";
import { supabase } from "./supabase";
import type { Item } from "./types";

interface Row {
  id: string;
  type: Item["type"];
  content: string;
  source_url: string | null;
  status: Item["status"];
  summary: string | null;
  tags: string[];
  created_at: string;
}

const fromRow = (r: Row): Item => ({
  id: r.id,
  type: r.type,
  content: r.content,
  sourceUrl: r.source_url ?? undefined,
  status: r.status,
  summary: r.summary ?? undefined,
  tags: r.tags ?? [],
  createdAt: r.created_at,
});

/** Giải thích lỗi thường gặp bằng tiếng Việt, dễ tự sửa. */
function explain(message: string): string {
  if (/relation .*items.* does not exist|Could not find the table/i.test(message)) {
    return "Chưa có bảng `items`. Hãy chạy file supabase/migrations/0001_items.sql trong SQL Editor của Supabase.";
  }
  return message;
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (!alive) return;
        if (err) setError(explain(err.message));
        else setItems((data as Row[]).map(fromRow));
        setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  /** Trả về true nếu lưu thành công để ô nhập biết có nên xoá chữ không. */
  const add = useCallback(async (content: string): Promise<boolean> => {
    const text = content.trim();
    if (!text) return false;
    const { data, error: err } = await supabase
      .from("items")
      .insert({ type: detectType(text), content: text, source_url: extractUrl(text) ?? null })
      .select()
      .single();
    if (err) {
      setError(explain(err.message));
      return false;
    }
    setError(null);
    setItems((prev) => [fromRow(data as Row), ...prev]);
    return true;
  }, []);

  /** "Cho mèo ăn": giai đoạn 3 sẽ gọi Claude để tóm tắt và gắn tag thật. */
  const process = useCallback(async (id: string) => {
    const summary = "(Bản tóm tắt AI sẽ xuất hiện ở đây sau giai đoạn 3.)";
    const { error: err } = await supabase
      .from("items")
      .update({ status: "processed", summary })
      .eq("id", id);
    if (err) return setError(explain(err.message));
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: "processed", summary } : it)),
    );
  }, []);

  const remove = useCallback(async (id: string) => {
    const { error: err } = await supabase.from("items").delete().eq("id", id);
    if (err) return setError(explain(err.message));
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  return { items, ready, error, add, process, remove };
}
