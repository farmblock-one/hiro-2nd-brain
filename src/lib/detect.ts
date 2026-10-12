import type { ItemType } from "./types";

const URL_RE = /https?:\/\/[^\s]+/i;

export function extractUrl(text: string): string | undefined {
  return text.match(URL_RE)?.[0];
}

export function detectType(text: string): ItemType {
  const url = extractUrl(text);
  if (!url) return "note";
  if (/(youtube\.com|youtu\.be)/i.test(url)) return "video";
  if (/\.pdf($|\?)/i.test(url)) return "pdf";
  return "link";
}
