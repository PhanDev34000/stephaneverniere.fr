const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Identifiant de connexion côté client = nom de projet (unique, obligatoire)
  identifiant: { type: String, unique: true, required: true }, 

  // Mot de passe hashé (bcrypt)
  password: { type: String, required: true },

  // Rôle : "admin" ou "utilisateur" 
  role: { type: String, enum: ['utilisateur', 'admin'], default: 'utilisateur' },

  // (Optionnel) infos de contact pour toi
  clientNom: String,
  clientEmail: String,

  // Galeries autorisées pour cet utilisateur (contrôle d’accès)
  galleries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' }],

  // Activer/Désactiver un accès sans supprimer le compte
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
