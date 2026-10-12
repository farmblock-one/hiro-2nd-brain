import { createClient } from "@supabase/supabase-js";

/**
 * URL và Publishable key được thiết kế để công khai trong frontend;
 * dữ liệu được bảo vệ bởi đăng nhập + Row Level Security (xem supabase/migrations).
 * KHÔNG đặt secret key / service_role ở đây.
 */
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pgtunsvqoneumauksikw.supabase.co";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_eT5edCNoJnZ6WI3SgqN24Q_ioBb0rr7";

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});
