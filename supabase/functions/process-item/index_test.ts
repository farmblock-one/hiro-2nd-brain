// Chạy: CATME_TEST=1 deno test --allow-env --allow-net --allow-read supabase/functions/process-item
import { assert, assertEquals } from "jsr:@std/assert@1";

Deno.env.set("CATME_TEST", "1");
Deno.env.set("SUPABASE_URL", "https://proj.supabase.co");
Deno.env.set("SUPABASE_ANON_KEY", "anon");
Deno.env.set("GEMINI_API_KEY", "gk");

const { handle, assertPublicUrl, htmlToText, youtubeId } = await import("./index.ts");

type Item = { id: string; type: string; content: string; source_url: string | null };
let item: Item | null;
let geminiBodies: any[] = [];
let geminiStatus = 200;
let updates: any[] = [];
let pageHtml = "";

const realFetch = globalThis.fetch;
globalThis.fetch = ((input: Request | URL | string, init?: RequestInit) => {
  const req = new Request(input as any, init);
  const u = new URL(req.url);
  const j = (b: unknown, s = 200) => Promise.resolve(new Response(JSON.stringify(b), { status: s, headers: { "content-type": "application/json" } }));
  if (u.hostname === "proj.supabase.co") {
    if (u.pathname.endsWith("/auth/v1/user")) {
      return req.headers.get("authorization") === "Bearer good" ? j({ id: "u1", aud: "authenticated" }) : j({ msg: "bad" }, 401);
    }
    if (u.pathname.endsWith("/rest/v1/items")) {
      if (req.method === "GET") return j(item);
      return req.json().then((b) => { updates.push(b); return j({ ...item, ...b }); });
    }
  }
  if (u.hostname === "generativelanguage.googleapis.com") {
    return req.json().then((b) => {
      geminiBodies.push(b);
      if (geminiStatus !== 200) return j({ error: "x" }, geminiStatus);
      return j({ candidates: [{ content: { parts: [{ text: JSON.stringify({ title: "Tiêu đề", summary: "Tóm tắt.", tags: ["Tài Chính", " thói quen "], domain: "Tài chính" }) }] } }] });
    });
  }
  if (u.hostname === "example.com") {
    const r = new Response(pageHtml, { headers: { "content-type": "text/html" } });
    Object.defineProperty(r, "url", { value: req.url }); // fetch thật luôn gán url cuối cùng
    return Promise.resolve(r);
  }
  return realFetch(input as any, init);
}) as typeof fetch;

const call = (id: string, token = "good") =>
  handle(new Request("https://fn/process-item", { method: "POST", headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ id }) }));

function reset(i: Item) { item = i; geminiBodies = []; updates = []; geminiStatus = 200; }

Deno.test("ghi chú: tóm tắt, chuẩn hoá tag, cập nhật status", async () => {
  reset({ id: "1", type: "note", content: "Mua cổ phiếu dài hạn", source_url: null });
  const res = await call("1");
  assertEquals(res.status, 200);
  assertEquals(updates[0].status, "processed");
  assertEquals(updates[0].tags, ["tài chính", "thói quen"]);
  assertEquals(updates[0].domain, "tài chính");
  assert(JSON.stringify(geminiBodies[0]).includes("Mua cổ phiếu dài hạn"));
});

Deno.test("video: gửi file_uri YouTube cho Gemini", async () => {
  const messy = "https://www.youtube.com/watch?v=ebabtFmldFU&t=37s";
  reset({ id: "2", type: "video", content: messy, source_url: messy });
  assertEquals((await call("2")).status, 200);
  // Tham số &t=37s phải được bỏ, nếu không Gemini hiểu nhầm là trang HTML.
  assertEquals(geminiBodies[0].contents[0].parts[1].file_data.file_uri, "https://www.youtube.com/watch?v=ebabtFmldFU");
});

Deno.test("bài viết: tải HTML, bỏ script, đưa chữ vào tài liệu", async () => {
  pageHtml = `<html><title>Bài hay</title><script>evil()</script><body><p>${"Nội dung rất hay về thói quen. ".repeat(10)}</p></body></html>`;
  reset({ id: "3", type: "link", content: "https://example.com/a", source_url: "https://example.com/a" });
  assertEquals((await call("3")).status, 200);
  const sent = JSON.stringify(geminiBodies[0]);
  assert(sent.includes("Bài hay") && sent.includes("thói quen") && !sent.includes("evil()"));
});

Deno.test("link nội bộ bị chặn (SSRF)", async () => {
  reset({ id: "4", type: "link", content: "http://169.254.169.254/x", source_url: "http://169.254.169.254/x" });
  assertEquals((await call("4")).status, 400);
  assertEquals(geminiBodies.length, 0);
  assertEquals(updates.length, 0);
});

Deno.test("hết quota Gemini → 429, item không bị đổi trạng thái", async () => {
  reset({ id: "5", type: "note", content: "abc", source_url: null });
  geminiStatus = 429;
  assertEquals((await call("5")).status, 429);
  assertEquals(updates.length, 0);
});

Deno.test("không đăng nhập / token sai → 401", async () => {
  reset({ id: "6", type: "note", content: "abc", source_url: null });
  assertEquals((await call("6", "bad")).status, 401);
  assertEquals((await handle(new Request("https://fn", { method: "POST", body: "{}" }))).status, 401);
});

Deno.test("item không tồn tại / không thuộc user (RLS trả rỗng) → 404", async () => {
  reset({ id: "7", type: "note", content: "x", source_url: null });
  item = null;
  assertEquals((await call("7")).status, 404);
});

Deno.test("youtubeId: nhiều dạng link", () => {
  const ID = "ebabtFmldFU";
  for (const u of [
    `https://www.youtube.com/watch?v=${ID}&t=37s`,
    `https://youtube.com/watch?list=PL1&v=${ID}`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}?si=abc&t=5`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube.com/live/${ID}?feature=share`,
  ]) assertEquals(youtubeId(u), ID, u);
  for (const bad of ["https://example.com/watch?v=ebabtFmldFU", "https://www.youtube.com/", "https://youtu.be/short", "không phải url"]) {
    assertEquals(youtubeId(bad), null, bad);
  }
});

Deno.test("tiện ích", () => {
  assertPublicUrl("https://example.com");
  for (const bad of ["ftp://a.com", "http://localhost", "http://10.0.0.1", "http://192.168.1.1", "http://[::1]/"]) {
    let threw = false;
    try { assertPublicUrl(bad); } catch { threw = true; }
    assert(threw, bad);
  }
  assertEquals(htmlToText("<title>T</title><p>a &amp; b</p>").text, "T a & b");
});
