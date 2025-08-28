const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema(
  {
    fileId: { type: String, required: true }, 
    name: { type: String, required: true },
    size: { type: Number, required: true },
    contentType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const gallerySchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    files: { type: [fileSchema], default: [] }
  },
  { timestamps: true, versionKey: false, collection: 'galleries' }
);

module.exports = mongoose.model('Gallery', gallerySchema);
