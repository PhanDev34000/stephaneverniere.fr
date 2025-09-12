const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  galleryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gallery', 
    required: true 
  },                          // lien vers la galerie
  filename: { 
    type: String, 
    required: true 
  },                          // nom du fichier dans R2
  url: { 
    type: String, 
    required: true 
  },                          // URL publique vers R2
  contentType: { 
    type: String 
  },                          // image/jpeg, image/png...
  size: { 
    type: Number 
  },                          // taille du fichier en octets
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);
