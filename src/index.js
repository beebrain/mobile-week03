// สคริปต์ฝั่งเซิร์ฟเวอร์ของร้าน (Cloudflare Worker)
// คำขอที่ตรงกับไฟล์ใน public/ เซิร์ฟเวอร์ส่งไฟล์ให้เลย ที่เหลือมาถึงโค้ดนี้
const LABELS = { student: "ผู้ส่ง", item: "สินค้า", qty: "จำนวน" };

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function reply(method, path, data) {
  let rows = "";
  for (const [key, value] of data) {
    rows += `<tr><td>${LABELS[key] || esc(key)}</td><td>${esc(value) || "(ว่าง)"}</td></tr>`;
  }
  const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ผลจากเซิร์ฟเวอร์</title></head><body>
<h1>เซิร์ฟเวอร์ได้รับใบสั่ง</h1>
<p>วิธีส่ง <b>${method}</b> · ที่อยู่ที่ขอ <code>${esc(path)}</code></p>
<p>อ่านแบบถอดรหัสภาษาไทย <code>${esc(decodeURIComponent(path))}</code></p>
<table border="1" cellpadding="8">${rows}</table>
<p>เซิร์ฟเวอร์สร้างหน้านี้ตอนได้รับคำขอ และไม่ได้เก็บใบสั่งไว้</p>
<p><a href="/">กลับหน้าฟอร์ม</a></p>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== "/order") {
      return new Response("ไม่พบหน้านี้", { status: 404 });
    }
    if (request.method === "POST") {
      const form = await request.formData();        // POST: ค่าอยู่ในตัวคำขอ (body)
      return reply("POST", url.pathname + url.search, form);
    }
    return reply("GET", url.pathname + url.search, url.searchParams);  // GET: ค่าอยู่ใน URL หลัง ?
  },
};
