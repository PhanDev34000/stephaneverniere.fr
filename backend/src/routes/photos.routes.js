const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');   
const Photo = require('../models/photo.model');          
const mongoose = require('mongoose');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const r2 = require('../services/r2');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'mes_photos/',   //  dossier dans Cloudinary
      context: true            //  c’est ça qui ramène les ALT
    });

    res.json(result.resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/photos  (upload + enregistrement DB)
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'file manquant' });

  const { album = 'prestations', tags = '', order } = req.body;

  cloudinary.uploader.upload_stream(
    { folder: `stephane/prestations/${album}`, resource_type: 'image', format: 'webp' },
    async (err, result) => {
      if (err) return res.status(500).json({ message: 'upload error', err });

      const base = result.public_id;
      const sm = cloudinary.url(base, { width: 600,  crop: 'limit', format: 'webp', secure: true });
      const md = cloudinary.url(base, { width:1200, crop: 'limit', format: 'webp', secure: true });
      const lg = cloudinary.url(base, { width:2000, crop: 'limit', format: 'webp', secure: true });

      const doc = await Photo.create({
        album,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        urls: { sm, md, lg },
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        order: isNaN(Number(order)) ? undefined : Number(order)
      });

      res.status(201).json(doc);
    }
  ).end(req.file.buffer);
});

// GET /api/photos?album=prestations&limit=20&after=<id>
router.get('/', async (req, res) => {
  try {
    let { album, limit = 20, after } = req.query;

    const q = {};

    if (album && typeof album === 'string') {
      q.album = album;
    }

    if (after) {
      if (typeof after !== 'string' || !after.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'paramètre "after" invalide' });
      }
      q._id = { $gt: new mongoose.Types.ObjectId(after) };
    }

    const limitNum = Math.min(Number(limit) || 20, 100);

    const items = await Photo.find(q)
      .sort({ order: 1, createdAt: 1, _id: 1 })
      .limit(limitNum);

    res.json({ items, next: items.length ? items[items.length - 1]._id : null });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});



// GET /api/photos/by-folder?folder=prestations|prestations/Mariage&limit=30
router.get('/by-folder', async (req, res) => {
  try {
    const { folder, limit = 30 } = req.query;
    if (!folder) return res.status(400).json({ message: 'folder requis' });

    const full = `stephane/${folder}`;
    // sous-dossier précis → folder= ; racine → asset_folder: <racine>/*
    const expr = folder.includes('/')
      ? `folder="${full}" AND resource_type:image`
      : `asset_folder:${full}/* AND resource_type:image`;

    const result = await cloudinary.search
      .expression(expr)
      .sort_by('created_at','desc')
      .max_results(Math.min(Number(limit), 100))
      .execute();

    const items = result.resources.map(r => ({
      publicId: r.public_id,
      width: r.width,
      height: r.height,
      urls: {
        sm: cloudinary.url(r.public_id, { width: 600,  crop: 'limit', format: 'webp', secure: true }),
        md: cloudinary.url(r.public_id, { width:1200, crop: 'limit', format: 'webp', secure: true }),
        lg: cloudinary.url(r.public_id, { width:2000, crop: 'limit', format: 'webp', secure: true }),
      }
    }));

    res.json({ items });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/r2/presign', async (req, res) => {
  try {
    const { name, contentType } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name requis' });

    const url = await r2.getPresignedUrl(name, contentType);
    res.json({ ok: true, url });
  } catch (e) {
    console.error('[R2 PRESIGN ERROR]', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});


module.exports = router;
