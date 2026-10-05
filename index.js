const fs = require('fs'); // تأكد من وجود هذا السطر في أعلى الملف

// 1. تحديد مصدر الكوكيز (من الملف المحلي أولاً، أو من المتغيرات)
let appState;
if (fs.existsSync('./appstate.json')) {
  appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf8'));
} else if (process.env.APPSTATE) {
  appState = JSON.parse(process.env.APPSTATE);
}

// 2. تمرير المتغير appState إلى دالة تسجيل الدخول
login({ appState }, (err, api) => {
  if (err) return console.error("خطأ في تسجيل الدخول:", err);

  console.log("تم تسجيل الدخول بنجاح!");
  
  // بقية كود البوت كما هو...
});
