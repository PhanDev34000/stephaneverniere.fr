// backend/src/routes/photobooth.routes.js
const express = require('express');
const { sendMail } = require('../utils/mailer');
const router = express.Router();
const { antiSpam } = require('../middlewares/antispam');


function pick(...vals) {
  for (const v of vals) if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  return '';
}

function normalize(b) {
  return {
    nom:     pick(b.nom, b.name, b.lastname),
    prenom:  pick(b.prenom, b.firstname),
    mail:    pick(b.mail, b.email),
    date:    pick(b.date, b.when),
    duree:   pick(b.duree, b.duration, b.dureeResa, b.reservationDuration),
    lieu:    pick(b.lieu, b.city, b.location, b.lieuPresta),
    message: pick(b.message, b.msg, b.text)
  };
}

// POST /api/photobooth/reserver
router.post('/photobooth/reserver', antiSpam, async (req, res) => {
  const { nom, prenom, mail, date, duree, lieu, message } = normalize(req.body || {});
  try {
    if (!mail || !message) {
      // on ne casse pas le front : 200 mais ok:false
      return res.status(200).json({ ok: false, message: 'Demande reçue, mais email non envoyé (email ou message manquant).' });
    }

    const subject = `PHOTObooth — Réservation — ${nom || '—'} ${prenom || ''}`.trim();
    const html = `
      <h3>Nouvelle demande de réservation Photobooth</h3>
      <ul>
        <li><b>Nom</b> : ${nom || '—'}</li>
        <li><b>Prénom</b> : ${prenom || '—'}</li>
        <li><b>Email</b> : ${mail}</li>
        <li><b>Date</b> : ${date || '—'}</li>
        <li><b>Durée</b> : ${duree || '—'}</li>
        <li><b>Lieu</b> : ${lieu || '—'}</li>
      </ul>
      <p><b>Message :</b></p>
      <pre style="white-space:pre-wrap;font-family:inherit;">${message}</pre>`;
    const text = `PHOTObooth - Réservation
Nom: ${nom || '—'} ${prenom || ''}
Email: ${mail}
Date: ${date || '—'}
Durée: ${duree || '—'}
Lieu: ${lieu || '—'}

Message:
${message}
`;

    await sendMail({ subject, html, text });
    return res.status(200).json({ ok: true, message: 'Demande envoyée.' });
  } catch (err) {
    console.error('[photobooth] mail error:', err.message);
    return res.status(200).json({ ok: false, message: 'Demande reçue, mais email non envoyé (config SMTP).' });
  }
});

module.exports = router;
