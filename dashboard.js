



const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Railway can provide PORT, but fall back to 8080.
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Dashboard
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KAILTH Bot - Cookie Control</title>

      <style>
        * {
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          background: #0f172a;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          padding: 15px;
        }

        .card {
          background: #1e293b;
          border-radius: 10px;
          padding: 20px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }

        h2 {
          text-align: center;
          color: #38bdf8;
          margin-top: 0;
        }

        p {
          font-size: 13px;
          color: #94a3b8;
          text-align: center;
        }

        textarea {
          width: 100%;
          height: 160px;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 6px;
          color: #4ade80;
          padding: 10px;
          resize: vertical;
          font-family: monospace;
          direction: ltr;
          text-align: left;
        }

        textarea:focus {
          outline: none;
          border-color: #6366f1;
        }

        button {
          width: 100%;
          background: #6366f1;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
          margin-top: 12px;
          cursor: pointer;
        }

        button:hover {
          background: #4f46e5;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .res {
          margin-top: 12px;
          text-align: center;
          font-weight: bold;
          min-height: 20px;
        }
      </style>
    </head>

    <body>
      <div class="card">

        <h2>⚜︎ KAILTH BOT ⚜︎</h2>

        <p>
          إلصق كود Appstate / Cookies الجديد هنا:
        </p>

        <form id="f">

          <textarea
            id="appstate"
            placeholder='[{"key":"datr","value":"..."}, ...]'
            required
          ></textarea>

          <button id="submitBtn" type="submit">
            حفظ وإعادة التشغيل
          </button>

        </form>

        <div id="status" class="res"></div>

      </div>

      <script>
        const form = document.getElementById('f');
        const textarea = document.getElementById('appstate');
        const status = document.getElementById('status');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const appstate = textarea.value.trim();

          if (!appstate) {
            status.style.color = '#f87171';
            status.innerText = 'من فضلك أدخل الـ Appstate أولاً';
            return;
          }

          status.style.color = '#38bdf8';
          status.innerText = 'جاري التحديث...';
          submitBtn.disabled = true;

          try {
            const response = await fetch('/update-appstate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                appstate: appstate
              })
            });

            const data = await response.json();

            if (data.success) {
              status.style.color = '#4ade80';
              status.innerText =
                'تم حفظ الكوكيز بنجاح! يتم تشغيل البوت الآن...';
            } else {
              status.style.color = '#f87171';
              status.innerText = 'خطأ: ' + data.message;
              submitBtn.disabled = false;
            }

          } catch (error) {
            console.error(error);

            status.style.color = '#f87171';
            status.innerText = 'فشل الاتصال بالسيرفر';
            submitBtn.disabled = false;
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Update Appstate
app.post('/update-appstate', (req, res) => {
  try {
    const { appstate } = req.body;

    if (!appstate || typeof appstate !== 'string') {
      return res.json({
        success: false,
        message: 'لم يتم إرسال Appstate'
      });
    }

    // Validate JSON
    const parsed = JSON.parse(appstate);

    if (!Array.isArray(parsed)) {
      return res.json({
        success: false,
        message: 'Appstate يجب أن يكون Array'
      });
    }

    // Save appstate
    const filePath = path.join(__dirname, 'appstate.json');

    fs.writeFileSync(
      filePath,
      JSON.stringify(parsed, null, 2),
      'utf8'
    );

    console.log('[Dashboard] Appstate updated successfully.');

    res.json({
      success: true
    });

    // Restart after response has been sent
    setTimeout(() => {
      console.log('[Dashboard] Restarting process...');
      process.exit(0);
    }, 1000);

  } catch (error) {
    console.error('[Dashboard] Appstate error:', error);

    res.json({
      success: false,
      message: 'صيغة Appstate غير صالحة'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`[Dashboard] Server running on port ${port}`);
  console.log(`[Dashboard] Listening on 0.0.0.0:${port}`);
});
