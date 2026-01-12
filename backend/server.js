require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const helmet   = require('helmet');
const cors     = require('cors');

const { loginLimiter, contactLimiter, photoboothLimiter } = require('./src/middlewares/rateLimiters');
const requireAdmin = require('./src/middlewares/requireAdmin');
const requireAuth  = require('./src/middlewares/requireAuth');
const authRoutes   = require('./src/routes/auth.routes');

// --- Routes
const adminClientsRoutes   = require('./src/routes/admin-clients.routes');
const adminGalleriesRoutes = require('./src/routes/admin-galleries.routes');
const contactRoutes        = require('./src/routes/contact.routes');
const photoboothRoutes     = require('./src/routes/photobooth.routes');
const downloadRoutes       = require('./src/routes/download.routes');
const photosRoutes         = require('./src/routes/photos.routes');

const app = express();

// ---------- Sécurité & middlewares globaux ----------
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// 🔍 Log pour voir l'origine et l'URL de chaque requête
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin, ' | URL:', req.method, req.originalUrl);
  next();
});

// ---------- CORS sécurisé ----------
const allowedOrigins = [
  'https://stephaneverniere.fr',
  'https://www.stephaneverniere.fr',
  'https://symbolic-rubia-svdev-70fd28d2.koyeb.app',
  'https://fluffy-orel-svdev34-1caab703.koyeb.app',
  'http://localhost:4200',        
  'http://127.0.0.1:4200' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// === PUBLIC ===
app.use('/api/photos', photosRoutes);   // ← AVANT l'auth

// ---------- Rate limiters ciblés (avant montage des routes) ----------
app.use('/api/auth/login', loginLimiter);
app.use('/api/contact', contactLimiter);
app.use('/api/photobooth/reserver', photoboothLimiter);


console.log('[Startup] memoryUsage:', process.memoryUsage());
console.log('[Startup] tmp folder content:', require('fs').readdirSync('/tmp'));


// ---------- Health ----------
app.get('/api/healthz', async (_req, res) => {
  try {
    if (!mongoose.connection.db) {
      return res.json({ ok: true, db: 'down', error: 'MongoDB not connected yet' });
    }

    await mongoose.connection.db.admin().ping();
    res.json({ ok: true, db: 'up' });
  } catch (err) {
    res.json({ ok: true, db: 'down', error: err.message });
  }
});

// ---------- Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/admin/clients',   requireAdmin, adminClientsRoutes);
app.use('/api/admin/galleries', requireAdmin, adminGalleriesRoutes);

app.use('/api', contactRoutes);
app.use('/api', photoboothRoutes);

// routes protégées (client/admin)
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/photos')) return next(); // pas d'auth pour /api/photos
  return requireAuth(req, res, next);
}, downloadRoutes);

// ---------- Handler d’erreurs ----------
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// ---------- Démarrage ----------
const PORT = process.env.PORT || 8000;

app.get('/health', (req,res)=>res.json({ ok: true }));

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ MONGODB_URI manquant dans .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(PORT, '0.0.0.0',() => console.log(`API prête sur http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Connexion MongoDB échouée:', err.message);
    process.exit(1);
  });

module.exports = app;
