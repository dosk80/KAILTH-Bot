const fs = require('fs');
const login = require('fca-unofficial'); // أو اسم مكتبة الفيسبوك المستخدمة لديك
const { startDashboard } = require('./dashboard');

// تشغيل سيرفر الداشبورد
startDashboard();

// قراءة الكوكيز بأمان
let appState;
try {
  if (fs.existsSync('./appstate.json')) {
    const rawData = fs.readFileSync('./appstate.json', 'utf8');
    appState = JSON.parse(rawData);
    console.log('[Info] تم قراءة الكوكيز من appstate.json');
  } else if (process.env.APPSTATE) {
    appState = JSON.parse(process.env.APPSTATE);
    console.log('[Info] تم قراءة الكوكيز من متغيّرات Railway');
  }
} catch (err) {
  console.error('[Error] خطأ في تحويل كود الكوكيز (JSON غير صحيح):', err.message);
}

if (!appState) {
  console.error('[Error] لم يتم العثور على كوكيز صالحة. يرجى إدخالها عبر الداشبورد أو Railway.');
} else {
  // تسجيل الدخول
  login({ appState }, (err, api) => {
    if (err) {
      console.error('[Error] فشل تسجيل الدخول! قد تكون الكوكيز منتهية الصلاحية:', err);
      return;
    }

    console.log('[Success] تم تسجيل الدخول بنجاح إلى فيسبوك!');

    // استماع للرسائل والأوامر
    api.listenMqtt((err, event) => {
      if (err) return console.error(err);

      // قم بإضافة معالجة الأوامر الخاصة بالبوت هنا
    });
  });
}
