const nodemailer = require('nodemailer');

const required = ['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','MAIL_TO'];
for (const k of required) {
  if (!process.env[k]) console.warn(`[mail] Missing env ${k}`);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE ?? 'true') !== 'false', // true par défaut
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

async function sendMail({ subject, html, text }) {
  const to = process.env.MAIL_TO;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const info = await transporter.sendMail({ from, to, subject, text, html });
  return info;
}

module.exports = { sendMail };
