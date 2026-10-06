const express = require('express');
const path = require('path');
const app = express();
let dashboardServer = null;

// Railway supplies PORT at runtime. Keep 3000 as a local development fallback.
const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

app.disable('x-powered-by');

function startDashboard() {
  if (dashboardServer) return dashboardServer;

  app.get('/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

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

  const server = app.listen(PORT, HOST, () => {
    console.log(`[Dashboard] Listening on http://${HOST}:${PORT}`);
  });
  dashboardServer = server;

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`[Error] PORT_BUSY: ${HOST}:${PORT} is already in use.`);
    } else {
      console.error('[Error] Dashboard server failed to start:', error);
    }
    process.exit(1);
  });

  return server;
}

module.exports = { startDashboard };
