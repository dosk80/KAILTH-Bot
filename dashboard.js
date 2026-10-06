const express = require('express');
const app = express();

// استخدام المنفذ الذي يحدده Railway تلقائياً
const PORT = process.env.PORT || 3000;

function startDashboard() {
  app.get('/', (req, res) => {
    // هنا يتم إرسال ملف الـ HTML الخاص باللوحة
    res.sendFile(__dirname + '/index.html'); 
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dashboard] السيرفر يعمل على المنفذ: ${PORT}`);
  });
}

module.exports = { startDashboard };
