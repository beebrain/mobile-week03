// สคริปต์ฝั่งเซิร์ฟเวอร์ของร้าน ทำงานเมื่อมีคำขอมาที่ /order
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
<table border="1" cellpadding="8">${rows}</table>
<p>เซิร์ฟเวอร์สร้างหน้านี้ตอนได้รับคำขอ และไม่ได้เก็บใบสั่งไว้</p>
<p><a href="/">กลับหน้าฟอร์ม</a></p>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

// GET: ค่าจากฟอร์มอยู่ใน URL หลังเครื่องหมาย ?
export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  return reply("GET", url.pathname + url.search, url.searchParams);
}

// POST: ค่าจากฟอร์มอยู่ในตัวคำขอ (body) ไม่อยู่ใน URL
export async function onRequestPost({ request }) {
  const url = new URL(request.url);
  const form = await request.formData();
  return reply("POST", url.pathname + url.search, form);
}
