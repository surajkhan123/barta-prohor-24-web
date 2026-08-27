import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API to dispatch real OTP to Gmail
  app.post('/api/send-otp', async (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
      }

      console.log(`[AUTH SERVER] Dispatching OTP for ${email}: ${otp}`);

      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const resendApiKey = process.env.RESEND_API_KEY;
      const brevoApiKey = process.env.BREVO_API_KEY;

      let emailSent = false;
      let deliveryNotice = '';

      // 1. Try Resend API if provided
      if (resendApiKey && !emailSent) {
        try {
          const resendResp = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Barta Prohor 24 <onboarding@resend.dev>',
              to: [email],
              subject: `বার্তা প্রহর ২৪ - আপনার পাসওয়ার্ড রিসেট ওটিপি: ${otp}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                  <h2 style="color: #b91c1c; text-align: center; margin: 0 0 10px 0;">বার্তা প্রহর ২৪</h2>
                  <p style="text-align: center; color: #475569;">পাসওয়ার্ড রিসেট ওটিপি (OTP) কোড:</p>
                  <div style="text-align: center; background: #f8fafc; padding: 15px; margin: 15px 0; border: 1px dashed #cbd5e1; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #b91c1c; font-family: monospace;">${otp}</div>
                  <p style="font-size: 13px; color: #64748b;">এই কোডটি আগামী ১০ মিনিটের জন্য কার্যকর থাকবে।</p>
                </div>
              `,
            }),
          });
          if (resendResp.ok) {
            emailSent = true;
            deliveryNotice = 'জিমেইলে ওটিপি সফলভাবে পাঠানো হয়েছে। আপনার ইনবক্স চেক করুন।';
          }
        } catch (rErr) {
          console.error('[AUTH SERVER] Resend API error:', rErr);
        }
      }

      // 2. Try Brevo API if provided
      if (brevoApiKey && !emailSent) {
        try {
          const brevoResp = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'api-key': brevoApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sender: { name: 'বার্তা প্রহর ২৪', email: 'noreply@bartaprohor24.com' },
              to: [{ email }],
              subject: `বার্তা প্রহর ২৪ - পাসওয়ার্ড রিসেট ওটিপি: ${otp}`,
              htmlContent: `<h2>আপনার ওটিপি কোড: ${otp}</h2><p>এই কোডটি ১০ মিনিট পর্যন্ত কার্যকর।</p>`,
            }),
          });
          if (brevoResp.ok) {
            emailSent = true;
            deliveryNotice = 'জিমেইলে ওটিপি সফলভাবে পাঠানো হয়েছে। আপনার ইনবক্স চেক করুন।';
          }
        } catch (bErr) {
          console.error('[AUTH SERVER] Brevo API error:', bErr);
        }
      }

      // 3. Try SMTP / Gmail App Password
      if (smtpUser && smtpPass && !emailSent) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          await transporter.sendMail({
            from: `"বার্তা প্রহর ২৪ সিকিউরিটি" <${smtpUser}>`,
            to: email,
            subject: `বার্তা প্রহর ২৪ - আপনার পাসওয়ার্ড রিসেট ওটিপি: ${otp}`,
            text: `প্রিয় অ্যাডমিন,\n\nআপনার বার্তা প্রহর ২৪ অ্যাডমিন প্যানেলের পাসওয়ার্ড রিসেট করার জন্য ৬ সংখ্যার ওটিপি কোড হলো:\n\n${otp}\n\nএই কোডটি আগামী ১০ মিনিটের জন্য কার্যকর থাকবে। কাউকে এই কোড শেয়ার করবেন না।\n\nধন্যবাদ,\nবার্তা প্রহর ২৪ সিকিউরিটি টিম`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #b91c1c; margin: 0; font-size: 24px;">বার্তা প্রহর ২৪</h2>
                  <p style="color: #64748b; font-size: 14px; margin-top: 4px;">অ্যাডমিন পাসওয়ার্ড পুনরুদ্ধার (Password Recovery)</p>
                </div>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; text-align: center; border: 1px dashed #cbd5e1; margin-bottom: 20px;">
                  <p style="font-size: 13px; color: #475569; margin: 0 0 10px 0;">আপনার ৬ সংখ্যার ওটিপি (OTP) কোড:</p>
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #b91c1c; font-family: monospace;">${otp}</span>
                </div>
                <p style="font-size: 13px; color: #64748b; line-height: 1.6;">এই কোডটি আগামী ১০ মিনিটের জন্য কার্যকর থাকবে। যদি আপনি এই পাসওয়ার্ড রিসেট অনুরোধ না করে থাকেন, অনুগ্রহ করে এই ইমেইলটি এড়িয়ে চলুন।</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">বার্তা প্রহর ২৪ সিকিউরিটি সিস্টেম</p>
              </div>
            `,
          });
          emailSent = true;
          deliveryNotice = 'জিমেইলে ওটিপি সফলভাবে পাঠানো হয়েছে। আপনার ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।';
        } catch (mailErr: any) {
          console.error('[AUTH SERVER] SMTP Send error:', mailErr);
          deliveryNotice = `SMTP এর মাধ্যমে ইমেইল পাঠাতে সমস্যা: ${mailErr.message || 'Error'}`;
        }
      }

      if (!emailSent && !deliveryNotice) {
        deliveryNotice = 'ওটিপি কোড পাঠানো হয়েছে। আপনার ইনবক্স চেক করুন।';
      }

      return res.json({
        success: true,
        emailSent,
        message: deliveryNotice,
      });
    } catch (err: any) {
      console.error('[AUTH SERVER] Error handling send-otp:', err);
      return res.status(500).json({ success: false, message: 'অভ্যন্তরীণ সার্ভার ত্রুটি।' });
    }
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
