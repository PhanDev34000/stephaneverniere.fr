const express = require('express');
const bcrypt = require('bcryptjs');
const { body, param, validationResult } = require('express-validator');
const User = require('../models/user.model'); 
const router = express.Router();

// Helpers
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Payload invalide', errors: errors.array() });
};

// GET /api/admin/clients  -> liste tous les non-admin
router.get('/', async (req, res) => {
  const users = await User.find({ role: { $ne: 'admin' } })
    .select('_id identifiant email isActive role')
    .sort({ identifiant: 1 });
  return res.json(users);
});

// POST /api/admin/clients  -> créer un client
router.post(
  '/',
  [
    body('identifiant').trim().notEmpty().withMessage('identifiant requis'),
    body('password').isString().isLength({ min: 6 }).withMessage('password min 6'),
    body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('email invalide'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Payload invalide', errors: errors.array() });
    }

    const { identifiant, password, email } = req.body;

    // Vérif doublons (email facultatif)
    const or = [{ identifiant }];
    if (email) or.push({ email });
    const exists = await User.findOne({ $or: or }).lean();
    if (exists) return res.status(409).json({ message: 'Identifiant ou email déjà utilisé' });

    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        identifiant,
        email: email || undefined,
        password: hash,
        role: 'utilisateur',      
        isActive: true,
        galleries: [],
      });

      return res.status(201).json({
        _id: user._id,
        identifiant: user.identifiant,
        email: user.email,
        isActive: user.isActive,
        role: user.role,
      });
    } catch (err) {
      console.error('Create client error:', err);
      if (err && err.code === 11000) {
        return res.status(409).json({ message: 'Duplicata (index unique)' });
      }
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

// PUT /api/admin/clients/:id  -> éditer identifiant/email/isActive
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('id invalide'),
    body('identifiant').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
    body('isActive').optional().isBoolean()
  ],
  async (req, res) => {
    const err = handleValidation(req, res); if (err) return;
    const { id } = req.params;
    const { identifiant, email, isActive } = req.body;

    const update = {};
    if (identifiant !== undefined) update.identifiant = identifiant;
    if (email !== undefined) update.email = email;
    if (isActive !== undefined) update.isActive = isActive;

    const updated = await User.findByIdAndUpdate(id, update, { new: true })
      .select('_id identifiant email isActive role');
    if (!updated) return res.status(404).json({ message: 'Client introuvable' });

    return res.json(updated);
  }
);

// DELETE /api/admin/clients/:id
router.delete('/:id', [param('id').isMongoId()], async (req, res) => {
  const err = handleValidation(req, res); if (err) return;
  const { id } = req.params;

  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Client introuvable' });

  return res.status(204).send();
});

// PUT /api/admin/clients/:id/password  -> changer le mot de passe
router.put(
  '/:id/password',
  [
    param('id').isMongoId().withMessage('id invalide'),
    body('password').isString().isLength({ min: 6 }).withMessage('password min 6')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Payload invalide', errors: errors.array() });

    const { id } = req.params;
    const { password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const updated = await User.findByIdAndUpdate(id, { password: hash });
    if (!updated) return res.status(404).json({ message: 'Client introuvable' });

    return res.status(204).send(); // rien à renvoyer
  }
);


module.exports = router;
