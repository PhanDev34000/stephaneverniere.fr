const express = require('express');
const { param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const archiver = require('archiver');
const Gallery = require('../models/gallery.model');

const router = express.Router();

function badReqIfErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Payload invalide', errors: errors.array() });
    return true;
  }
  return false;
}

function safeName(s) {
  return (s || 'galerie')
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .slice(0, 80);
}

// GET /api/me/galleries → liste des galeries du user connecté (résumé)
router.get('/me/galleries', async (req, res, next) => {
  try {
    const userId = req.user?.sub || req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });

    const list = await Gallery.find({ clientId: userId })
      .sort({ createdAt: -1 })
      .select('_id title files createdAt')
      .lean();

    // On renvoie un résumé léger (count)
    const data = (list || []).map(g => ({
      _id: g._id,
      title: g.title,
      filesCount: Array.isArray(g.files) ? g.files.length : 0,
      createdAt: g.createdAt
    }));

    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/galleries/:id/download.zip → téléchargement ZIP de toute la galerie
router.get(
  '/galleries/:id/download.zip',
  [param('id').isMongoId()],
  async (req, res, next) => {
    try {
      if (badReqIfErrors(req, res)) return;

      const { id } = req.params;
      const gal = await Gallery.findById(id).lean();
      if (!gal) return res.status(404).json({ message: 'Galerie introuvable' });

      const isAdmin = req.user?.role === 'admin';
      const userId = req.user?.sub || req.user?._id || req.user?.id;
      if (!isAdmin && String(gal.clientId) !== String(userId)) {
        return res.status(403).json({ message: 'Accès refusé' });
      }

      const filesColl = mongoose.connection.db.collection('photos.files');
      const files = await filesColl
        .find({ 'metadata.galleryId': id })
        .project({ _id: 1, filename: 1, length: 1, uploadDate: 1 })
        .toArray();

      if (!files.length) {
        return res.status(404).json({ message: 'Aucun fichier dans cette galerie.' });
      }

      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'photos' });
      const zipName = safeName(gal.title) + '.zip';

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);

      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.on('error', (err) => next(err));
      archive.pipe(res);

      for (const f of files) {
        const stream = bucket.openDownloadStream(f._id);
        archive.append(stream, { name: f.filename || (f._id.toString() + '.bin') });
      }

      archive.finalize();
    } catch (err) {
      console.error('Download zip error:', err);
      next(err);
    }
  }
);

module.exports = router;
