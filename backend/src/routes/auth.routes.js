const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

// POST /api/auth/login
router.post(
  '/login',
  [
    body('password').isString().notEmpty().withMessage('password requis'),
    body('identifiant').optional().isString(),
    body('email').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: 'Payload invalide', errors: errors.array() });

    const { identifiant, email, password } = req.body;

    const query = identifiant
      ? { identifiant }
      : email
      ? { email }
      : null;

    if (!query) return res.status(400).json({ message: 'identifiant ou email requis' });

    const user = await User.findOne(query).lean();
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });
    if (user.isActive === false) return res.status(403).json({ message: 'Compte inactif' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

    const payload = { _id: user._id, role: user.role, identifiant: user.identifiant };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || '24h',
    });

    return res.json({
      token,
      user: {
        _id: user._id,
        identifiant: user.identifiant,
        role: user.role,
        email: user.email || null,
        isActive: user.isActive !== false,
      },
    });
  }
);


// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const me = await User.findById(req.user._id).select('_id identifiant role email isActive').lean();
  if (!me) return res.status(404).json({ message: 'Utilisateur introuvable' });
  return res.json(me);
});

module.exports = router;
