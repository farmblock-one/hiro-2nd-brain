# Cat.Me 🐈‍⬛

Second brain cá nhân, canh giữ bởi một chú mèo Tuxedo. Mobile-first PWA, host tĩnh trên GitHub Pages, backend là Supabase.

## Trạng thái
- [x] **Giai đoạn 1:** khung Next.js, theme Tuxedo, Inbox, PWA + Share Target (dữ liệu tạm trong `localStorage`)
- [ ] Giai đoạn 2: đăng nhập + lưu Supabase
- [ ] Giai đoạn 3: AI tóm tắt/tag (Supabase Edge Functions + Claude), transcript YouTube
- [ ] Giai đoạn 4: upload PDF + tìm kiếm ngữ nghĩa
- [ ] Giai đoạn 5: hỏi đáp trên kho kiến thức, gợi ý liên kết

## Chạy local
```bash
npm install
npm run dev
```

## Deploy lên GitHub Pages
1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Merge vào `main`; workflow `.github/workflows/deploy.yml` tự build và đăng.
3. App chạy ở `https://<user>.github.io/hiro-2nd-brain/`.

## Bảo mật
Repo public nên **không bao giờ commit** `service_role` key hay `ANTHROPIC_API_KEY`. Chỉ `NEXT_PUBLIC_SUPABASE_URL` và anon key được đưa vào frontend (an toàn nhờ Row Level Security). Key Claude đặt trong Supabase secrets.
