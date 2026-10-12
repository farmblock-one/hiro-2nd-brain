export type ItemType = "note" | "link" | "video" | "book" | "pdf";
export type ItemStatus = "inbox" | "processed";

export interface Item {
  id: string;
  type: ItemType;
  /** Nội dung người dùng nhập: text, hoặc link */
  content: string;
  sourceUrl?: string;
  status: ItemStatus;
  /** Do AI điền ở giai đoạn 3; hiện là dữ liệu giả lập */
  summary?: string;
  tags: string[];
  createdAt: string;
}

export const TYPE_META: Record<ItemType, { label: string; emoji: string }> = {
  note: { label: "Ghi chú", emoji: "📝" },
  link: { label: "Bài viết", emoji: "🔗" },
  video: { label: "Video", emoji: "🎬" },
  book: { label: "Sách", emoji: "📚" },
  pdf: { label: "PDF", emoji: "📄" },
};
