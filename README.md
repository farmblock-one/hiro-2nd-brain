# Cat.Me 🐈‍⬛

Second brain cá nhân, canh giữ bởi một chú mèo Tuxedo. Mobile-first PWA, host tĩnh trên GitHub Pages, backend là Supabase.

## Trạng thái
- [x] **Giai đoạn 1:** khung Next.js, theme Tuxedo, Inbox, PWA + Share Target (dữ liệu tạm trong `localStorage`)
- [x] **Giai đoạn 2:** đăng nhập email/mật khẩu + lưu Supabase (RLS)
- [x] **Giai đoạn 3:** AI tóm tắt/tag bằng Gemini (Supabase Edge Function `process-item`); Gemini đọc trực tiếp video YouTube, bài viết và PDF link
- [ ] Giai đoạn 4: upload PDF + tìm kiếm ngữ nghĩa
- [ ] Giai đoạn 5: hỏi đáp trên kho kiến thức, gợi ý liên kết

## Chạy local
```bash
npm install
npm run dev
```

## Thiết lập Supabase (một lần)
1. Chạy `supabase/migrations/0001_items.sql` trong **SQL Editor** của Supabase.
2. Tạo user ở **Authentication → Users → Add user** (tích Auto Confirm), và tắt Allow new users to sign up.
3. Project URL và Publishable key nằm trong `src/lib/supabase.ts` (công khai theo thiết kế); có thể ghi đè bằng `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Bật AI (giai đoạn 3)
1. Chạy `supabase/migrations/0002_ai_fields.sql` trong SQL Editor.
2. Lấy Gemini API key ở aistudio.google.com (gói miễn phí).
3. Supabase → **Edge Functions → Secrets**: thêm `GEMINI_API_KEY`. Tuỳ chọn `GEMINI_MODEL` (mặc định `gemini-3.5-flash-lite`).
4. Supabase → **Edge Functions → Deploy a new function → Via Editor**, tên `process-item`, dán nội dung `supabase/functions/process-item/index.ts`, **tắt "Verify JWT"** (function tự xác thực bằng `auth.getUser()`), rồi Deploy.
5. Test function: `cd supabase/functions && CATME_TEST=1 deno test --allow-env --allow-net --allow-read process-item`.

## Deploy lên GitHub Pages
1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Merge vào `main`; workflow `.github/workflows/deploy.yml` tự build và đăng.
3. App chạy ở `https://<user>.github.io/hiro-2nd-brain/`.

## Bảo mật
Repo public nên **không bao giờ commit** `service_role` key hay `ANTHROPIC_API_KEY`. Chỉ `NEXT_PUBLIC_SUPABASE_URL` và anon key được đưa vào frontend (an toàn nhờ Row Level Security). Key Claude đặt trong Supabase secrets.
