const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Connexion : identifiant + mot de passe
exports.login = async (req, res) => {
  try {
    const { identifiant, password } = req.body;

    const user = await User.findOne({ identifiant });
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' });

    if (!user.isActive) return res.status(403).json({ error: 'Compte désactivé' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });

    const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, role: user.role });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Créer un utilisateur (compte client) — réservé à l’admin
exports.createUser = async (req, res) => {
  try {
    const { identifiant, password, clientNom, clientEmail, galleries } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      identifiant,
      password: hash,
      role: 'utilisateur',
      clientNom,
      clientEmail,
      galleries
    });

    res.status(201).json({ id: user._id, identifiant: user.identifiant });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Récupérer ses infos (token obligatoire)
exports.me = (req, res) => {
  res.json({ userId: req.userId, role: req.role });
};
