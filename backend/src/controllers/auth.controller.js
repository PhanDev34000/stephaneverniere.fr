const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Connexion : identifiant ou email + mot de passe
exports.login = async (req, res) => {
  try {
    const { identifiant, email, password } = req.body;

    if (!password || (!identifiant && !email)) {
      return res.status(400).json({ message: 'Identifiant ou email et mot de passe requis' });
    }

    const query = identifiant ? { identifiant } : { email };
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    if (user.isActive === false) {
      return res.status(403).json({ message: 'Compte désactivé' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

    const payload = { _id: user._id, role: user.role, identifiant: user.identifiant };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        _id: user._id,
        identifiant: user.identifiant,
        role: user.role,
        email: user.email || null,
        isActive: user.isActive !== false
      }
    });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', error: e.message });
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
    res.status(400).json({ message: 'Erreur création utilisateur', error: e.message });
  }
};

// Récupérer ses infos (token obligatoire)
exports.me = (req, res) => {
  res.json({ userId: req.userId, role: req.role });
};
