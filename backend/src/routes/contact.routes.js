// backend/src/routes/contact.routes.js
const express = require('express');
const { sendMail } = require('../utils/mailer');
const router = express.Router();
const { antiSpam } = require('../middlewares/antispam');


/** Récupère la première valeur non vide */
function pick(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
}

/** Normalise librement le corps */
function normalize(b) {
  const nom     = pick(b.nom, b.name, b.lastname, b.lastName, b.surname);
  const prenom  = pick(b.prenom, b.firstname, b.firstName, b.givenname, b.givenName);
  const mail    = pick(b.mail, b.email);
  const tel     = pick(b.tel, b.phone, b.telephone, b.mobile);
  const date    = pick(b.date, b.when, b.eventDate);
  const lieu    = pick(b.lieu, b.ville, b.city, b.location);
  const message = pick(b.message, b.msg, b.text, b.comment);

  // 'pour' très permissif
  let pourRaw = pick(b.pour, b.sujet, b.subject, b.type, b.service).toLowerCase();
  let pour = 'Photographe';
  if (pourRaw.includes('booth')) pour = 'Photobooth';
  if (pourRaw.includes('les') && pourRaw.includes('2') || pourRaw.includes('both')) pour = 'Les 2';

  return { nom, prenom, mail, tel, pour, date, lieu, message };
}

router.post('/contact', antiSpam, async (req, res, next) => {
  try {
    // Body debug minimal (utile si souci) :
    console.log('[contact] body:', req.body);

    const { nom, prenom, mail, tel, pour, date, lieu, message } = normalize(req.body || {});
    // Garde-fous doux : si pas d’email ou pas de message, on refuse proprement
    if (!mail || !message) {
      return res.status(200).json({ ok: false, message: 'Message reçu côté site, mais email non envoyé (mail ou message manquant).' });
    }

    const subject = `CONTACT — ${pour} — ${nom || '—'} ${prenom || ''}`.trim();
    const html = `
      <h3>Nouveau message de contact</h3>
      <ul>
        <li><b>Nom</b> : ${nom || '—'}</li>
        <li><b>Prénom</b> : ${prenom || '—'}</li>
        <li><b>Email</b> : ${mail}</li>
        <li><b>Téléphone</b> : ${tel || '—'}</li>
        <li><b>Pour</b> : ${pour}</li>
        <li><b>Date</b> : ${date || '—'}</li>
        <li><b>Lieu</b> : ${lieu || '—'}</li>
      </ul>
      <p><b>Message :</b></p>
      <pre style="white-space:pre-wrap;font-family:inherit;">${message}</pre>
    `;
    const text =
`CONTACT ${pour} - ${nom || '—'} ${prenom || ''}
Email: ${mail}
Tel: ${tel || '—'}
Date: ${date || '—'}
Lieu: ${lieu || '—'}

Message:
${message}
`;

    await sendMail({ subject, html, text });
    return res.status(200).json({ ok: true, message: 'Message envoyé.' });
  } catch (err) {
    console.error('[contact] send error:', err.message);
    next(err);
  }
});

module.exports = router;
