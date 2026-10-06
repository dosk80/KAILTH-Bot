const fs = require('fs');
const login = require('fca-unofficial');
const { startDashboard } = require('./dashboard');

// 1. تشغيل سيرفر الداشبورد
startDashboard();

// 2. تحميل ملف الإعدادات config.json
let config = { prefix: "⚜︎", adminID: "61594779320771" };
if (fs.existsSync('./config.json')) {
  try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  } catch (e) {
    console.error('[Error] خطأ في قراءة ملف config.json:', e.message);
  }
}

// 3. قراءة الكوكيز بأمان
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

// 4. تسجيل الدخول والاستماع للرسائل
if (!appState) {
  console.error('[Error] لم يتم العثور على كوكيز صالحة. يرجى إدخالها عبر الداشبورد أو Railway.');
} else {
  login({ appState }, (err, api) => {
    if (err) {
      console.error('[Error] فشل تسجيل الدخول! قد تكون الكوكيز منتهية الصلاحية:', err);
      return;
    }

    console.log('[Success] تم تسجيل الدخول بنجاح إلى فيسبوك!');

    // ضبط إعدادات الاستماع
    api.setOptions({ listenEvents: true, selfListen: false });

    // الاستماع للرسائل والأوامر
    api.listenMqtt((err, event) => {
      if (err) return console.error(err);

      // التعامل مع الرسائل النصية فقط
      if (event.type === 'message' || event.type === 'message_reply') {
        const body = event.body ? event.body.trim() : '';
        const senderID = event.senderID;

        // التحقق مما إذا كان المرسل هو الأدمن
        const isAdmin = Array.isArray(config.adminID) 
          ? config.adminID.includes(senderID) 
          : config.adminID === senderID;

        // البادئة المسجلة في Config
        const prefix = config.prefix || '⚜︎';

        if (body.startsWith(prefix + 'مساعدة') || body.startsWith(prefix + 'help') || body.toLowerCase() === 'help') {
          const replyText = `⚜︎ بوت KAILTH يعمل بنجاح! ⚜︎\n\n` +
                            `• البادئة (Prefix): ${prefix}\n` +
                            `• رتبتك: ${isAdmin ? 'أدمن 👑' : 'مستخدم عادي 👤'}\n\n` +
                            `الأوامر المتاحة:\n` +
                            `${prefix}ping - فحص سرعة الاستجابة\n` +
                            `${prefix}id - معرفة الآيدي الخاص بك`;
          
          api.sendMessage(replyText, event.threadID, event.messageID);
        }

        // أمر فحص الاتصال
        else if (body === prefix + 'ping') {
          api.sendMessage('شغال 100% ⚡', event.threadID, event.messageID);
        }

        // أمر معرفة ID الحساب
        else if (body === prefix + 'id') {
          api.sendMessage(`ID حسابك هو: ${senderID}`, event.threadID, event.messageID);
        }
      }
    });
  });
}
