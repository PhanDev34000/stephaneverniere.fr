// Rejette si un champ "honeypot" (rempli par les bots) est présent
function antiSpam(req, res, next) {
  const b = req.body || {};
  const traps = [b.hp, b._h, b.honeypot, b.website]; 
  const filled = traps.find(v => v !== undefined && String(v).trim() !== '');
  if (filled) {
    return res.status(200).json({ ok: false, message: 'Spam détecté.' }); // on ne casse pas le front
  }
  return next();
}
module.exports = { antiSpam };
