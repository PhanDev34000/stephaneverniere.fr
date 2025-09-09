const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  album: { type: String, default: 'prestations', index: true },
  publicId: String,
  width: Number,
  height: Number,
  urls: {
    sm: String,  // ~600px
    md: String,  // ~1200px
    lg: String   // ~2000px
  },
  tags: [String],
  order: Number
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);
