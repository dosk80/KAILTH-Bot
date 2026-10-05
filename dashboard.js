const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KAILTH Bot - Cookie Control</title>
      <style>
        body { font-family: sans-serif; background: #0f172a; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 15px; }
        .card { background: #1e293b; border-radius: 10px; padding: 20px; width: 100%; max-width: 450px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); }
        h2 { text-align: center; color: #38bdf8; margin-top: 0; }
        textarea { width: 100%; height: 160px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #4ade80; padding: 10px; box-sizing: border-box; font-family: monospace; }
        button { width: 100%; background: #6366f1; color: #fff; border: none; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 12px; cursor: pointer; }
        .res { margin-top: 12px; text-align: center; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>⚜︎ KAILTH BOT ⚜︎</h2>
        <p style="font-size:13px; color:#94a3b8; text-align:center;">إلصق كود Appstate / Cookies الجديد هنا:</p>
        <form id="f">
          <textarea id="appstate" placeholder='[{"key": "datr", "value": "..."}, ...]' required></textarea>
          <button type="submit">حفظ وإعادة التشغيل</button>
        </form>
        <div id="status" class="res"></div>
      </div>
      <script>
        document.getElementById('f').addEventListener('submit', async (e) => {
          e.preventDefault();
          const s = document.getElementById('status');
          s.style.color = '#38bdf8';
          s.innerText = 'جاري التحديث...';
          try {
            const res = await fetch('/update-appstate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ appstate: document.getElementById('appstate').value })
            });
            const data = await res.json();
            if (data.success) {
              s.style.color = '#4ade80';
              s.innerText = 'تم حفظ الكوكيز بنجاح! يتم تشغيل البوت الآن...';
            } else {
              s.style.color = '#f87171';
              s.innerText = 'خطأ: ' + data.message;
            }
          } catch {
            s.style.color = '#f87171';
            s.innerText = 'فشل الاتصال بالسيرفر';
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.post('/update-appstate', (req, res) => {
  try {
    const { appstate } = req.body;
    JSON.parse(appstate);
    fs.writeFileSync('./appstate.json', appstate, 'utf8');
    res.json({ success: true });
    setTimeout(() => process.exit(0), 1000);
  } catch {
    res.json({ success: false, message: 'صيغة Appstate غير صالحة' });
  }
});

function startDashboard() {
  app.listen(port, () => console.log(`[Dashboard] Server running on port ${port}`));
}

module.exports = { startDashboard };
