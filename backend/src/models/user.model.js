const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Identifiant de connexion (ex: nom de prestation) — unique, insensible aux espaces/casse
  identifiant: { type: String, required: true, unique: true, trim: true, lowercase: true },

  // Email (pour l’admin, ou optionnel pour clients)
  email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },

  // Mot de passe hashé (bcrypt)
  password: { type: String, required: true },

  // Rôle : "admin" ou "utilisateur"
  role: { type: String, enum: ['utilisateur', 'admin'], default: 'utilisateur' },

  // (Optionnel) infos de contact
  clientNom: String,
  clientEmail: String,

  // Galeries autorisées pour cet utilisateur
  galleries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gallery', default: [] }],

  // Activer/Désactiver l’accès sans supprimer le compte
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Masquer le password dans les sorties JSON
userSchema.set('toJSON', {
  transform: (_doc, ret) => { delete ret.password; return ret; }
});

// Index explicites (sécurise l’unicité en prod)
userSchema.index({ identifiant: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);
