// backend/src/routes/admin-galleries.routes.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const multer = require('multer');
const { Readable } = require('stream');
const Gallery = require('../models/gallery.model');
const router = express.Router();
const Photo = require('../models/photo.model');
const fs = require('fs');


// ----- Multer (stockage temporaire disque) -----
const upload = multer({
  storage: multer.diskStorage({
    destination: '/tmp', // répertoire temporaire autorisé sur Koyeb
    filename: (req, file, cb) => {
      // on garde un nom unique pour éviter les collisions
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  limits: { files: 100, fileSize: 200 * 1024 * 1024 } // 200 Mo / fichier
});

// ----- Helpers -----
function badRequestIfErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Payload invalide', errors: errors.array() });
    return true;
  }
  return false;
}

// (option) supprime tout index legacy contenant "slug"
async function ensureNoLegacySlugIndex() {
  try {
    const indexes = await Gallery.collection.indexes();
    const legacy = indexes.find(i => i.key && Object.prototype.hasOwnProperty.call(i.key, 'slug'));
    if (legacy) {
      await Gallery.collection.dropIndex(legacy.name);
      console.log('[admin-galleries] Legacy index dropped:', legacy.name);
    }
  } catch (e) {
    // on log mais on ne bloque pas
    console.warn('[admin-galleries] ensureNoLegacySlugIndex warn:', e.message);
  }
}

// ----- Routes -----
// GET /api/admin/galleries → liste
router.get('/', async (_req, res, next) => {
  try {
    const list = await Gallery.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) { next(err); }
});

// POST /api/admin/galleries → créer (clientId + title)
router.post(
  '/',
  [
    body('clientId').isMongoId().withMessage('clientId invalide'),
    body('title').isString().notEmpty().withMessage('title requis'),
  ],
  async (req, res, next) => {
    try {
      if (badRequestIfErrors(req, res)) return;

      await ensureNoLegacySlugIndex();

      const { clientId, title } = req.body;

      const g = await Gallery.create({
        clientId,
        title,
        files: [],
      });

      res.status(201).json(g);
    } catch (err) {
      console.error('Create gallery error:', err);
      if (err?.name === 'CastError' || err?.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    }
  }
);

// POST /api/admin/galleries/:id/files → upload (champ "files") vers GridFS (bucket "photos")
router.post(
  '/:id/files',
  [param('id').isMongoId()],
  upload.array('files', 100), // ← important : accepte jusqu'à 100 fichiers
  async (req, res, next) => {
    try {
      if (badRequestIfErrors(req, res)) return;

      const { id } = req.params;
      const gal = await Gallery.findById(id);
      if (!gal) return res.status(404).json({ message: 'Galerie introuvable' });

      const files = req.files || [];
      if (!files.length) return res.status(400).json({ message: 'Aucun fichier reçu (champ "files").' });

      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'photos' });

      const added = [];
      for (const f of files) {
        const filename = `${Date.now()}-${f.originalname}`;
        const uploadStream = bucket.openUploadStream(filename, {
          contentType: f.mimetype,
          metadata: {
            galleryId: id,
            uploadedBy: (req.user && (req.user.sub || req.user._id)) || 'admin',
          },
        });

        // Source du flux : buffer (memoryStorage) OU fichier disque (diskStorage)
        const inputStream = f.buffer ? Readable.from(f.buffer) : fs.createReadStream(f.path);

        const fileId = await new Promise((resolve, reject) => {
          inputStream
            .on('error', reject)
            .pipe(uploadStream)
            .on('error', reject)
            .on('finish', () => {
              // Nettoyage du fichier temporaire si on est en diskStorage
              if (f.path) fs.unlink(f.path, () => {});
              resolve(uploadStream.id);
            });
        });

        added.push({
          fileId: String(fileId),
          name: f.originalname,
          size: f.size,
          contentType: f.mimetype,
          uploadedAt: new Date(),
        });
      }

      gal.files.push(...added);
      await gal.save();

      res.json(gal);
    } catch (err) {
      console.error('Upload files error:', err);
      next(err);
    }
  }
);


// PUT /api/admin/galleries/:id → update (title)
router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('title').optional().isString().notEmpty(),
  ],
  async (req, res, next) => {
    try {
      if (badRequestIfErrors(req, res)) return;

      const { id } = req.params;
      const update = {};
      if (req.body.title !== undefined) update.title = req.body.title;

      const updated = await Gallery.findByIdAndUpdate(id, update, { new: true });
      if (!updated) return res.status(404).json({ message: 'Galerie introuvable' });

      res.json(updated);
    } catch (err) { next(err); }
  }
);

// DELETE /api/admin/galleries/:id → supprime galerie + fichiers GridFS
router.delete('/:id', [param('id').isMongoId()], async (req, res, next) => {
  try {
    if (badRequestIfErrors(req, res)) return;

    const { id } = req.params;
    const gal = await Gallery.findById(id);
    if (!gal) return res.status(404).json({ message: 'Galerie introuvable' });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'photos' });
    const deletions = (gal.files || []).map(f => {
      const oid = typeof f.fileId === 'string' ? new mongoose.Types.ObjectId(f.fileId) : f.fileId;
      return bucket.delete(oid).catch(() => null);
    });
    await Promise.all(deletions);

    await Gallery.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) { next(err); }
});

// Ajouter une photo dans une galerie
router.post('/:id/photos', async (req, res) => {
  try {
    const { filename, url } = req.body;
    if (!filename || !url) {
      return res.status(400).json({ error: 'filename et url requis' });
    }

    const photo = await Photo.create({
      filename,
      url,
      galleryId: req.params.id
    });

    res.json({ ok: true, photo });
  } catch (err) {
    console.error('[ADD PHOTO ERROR]', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});


module.exports = router;
