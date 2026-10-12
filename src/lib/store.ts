"use client";

import { useCallback, useEffect, useState } from "react";
import { detectType, extractUrl } from "./detect";
import { supabase } from "./supabase";
import type { Item, KeyPoint } from "./types";

interface Row {
  id: string;
  type: Item["type"];
  content: string;
  source_url: string | null;
  status: Item["status"];
  title: string | null;
  summary: string | null;
  domain: string | null;
  tags: string[];
  key_points: KeyPoint[] | null;
  quotes: string[] | null;
  action_items: string[] | null;
  created_at: string;
}

const fromRow = (r: Row): Item => ({
  id: r.id,
  type: r.type,
  content: r.content,
  sourceUrl: r.source_url ?? undefined,
  status: r.status,
  title: r.title ?? undefined,
  summary: r.summary ?? undefined,
  domain: r.domain ?? undefined,
  tags: r.tags ?? [],
  keyPoints: r.key_points ?? [],
  quotes: r.quotes ?? [],
  actionItems: r.action_items ?? [],
  createdAt: r.created_at,
});

/** Giải thích lỗi thường gặp bằng tiếng Việt, dễ tự sửa. */
function explain(message: string): string {
  if (/relation .*items.* does not exist|Could not find the table/i.test(message)) {
    return "Chưa có bảng `items`. Hãy chạy file supabase/migrations/0001_items.sql trong SQL Editor của Supabase.";
  }
  return message;
}

function explainProcess(message: string): string {
  if (/Failed to send a request to the Edge Function|FunctionsFetchError/i.test(message)) {
    return "Chưa gọi được function process-item. Kiểm tra function đã được deploy trên Supabase chưa.";
  }
  if (/column .*(title|domain|key_points|quotes|action_items)|Could not find the '(title|domain|key_points|quotes|action_items)' column/i.test(message)) {
    return "Thiếu cột AI. Hãy chạy 0002_ai_fields.sql và 0003_rich_summary.sql (thư mục supabase/migrations) trong SQL Editor.";
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

  /** "Cho mèo ăn": Edge Function gọi Gemini để tóm tắt và gắn tag. Trả về true nếu thành công. */
  const process = useCallback(async (id: string): Promise<boolean> => {
    const { data, error: err } = await supabase.functions.invoke("process-item", { body: { id } });
    if (err) {
      let message = err.message;
      // Lỗi HTTP của function mang thông điệp tiếng Việt trong body.
      const ctx = (err as { context?: Response }).context;
      if (ctx && typeof ctx.json === "function") {
        message = (await ctx.json().catch(() => null))?.error ?? message;
      }
      setError(explainProcess(message));
      return false;
    }
    setError(null);
    setItems((prev) => prev.map((it) => (it.id === id ? fromRow(data.item as Row) : it)));
    return true;
  }, []);

  const remove = useCallback(async (id: string) => {
    const { error: err } = await supabase.from("items").delete().eq("id", id);
    if (err) return setError(explain(err.message));
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  return { items, ready, error, add, process, remove };
}
