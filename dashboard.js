const express = require('express');
const path = require('path');
const app = express();

// إجبار Express على استغلال المنفذ المخصص من Railway
const PORT = process.env.PORT || 3000;

function startDashboard() {
  // إرسال ملف index.html إذا كان موجوداً، أو عرض الداشبورد مباشرة
  app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'index.html');
    const fs = require('fs');
    
    if (fs.existsSync(htmlPath)) {
      res.sendFile(htmlPath);
    } else {
      res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>KAILTH Bot Dashboard</title>
          <style>
            body { background: #0d0f17; color: white; font-family: sans-serif; text-align: center; padding: 50px 20px; }
            .card { background: #161926; padding: 20px; border-radius: 12px; border: 1px solid #232738; max-width: 400px; margin: 0 auto; }
            .status { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>⚜︎ بوت KAILTH يعمل بنجاح ⚜︎</h2>
            <p class="status">● حالة الخادم: متصل</p>
            <p>سيرفر الداشبورد شغال بدون أخطاء!</p>
          </div>
        </body>
        </html>
      `);
    }
  });

  // الاستماع على 0.0.0.0 وهو شرط أساسي لـ Railway
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dashboard] السيرفر يعمل الآن بنجاح على المنفذ: ${PORT}`);
  });
}

module.exports = { startDashboard };
