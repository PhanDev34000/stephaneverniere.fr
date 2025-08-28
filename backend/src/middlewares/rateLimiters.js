// backend/src/middlewares/rateLimiters.js
const { rateLimit } = require('express-rate-limit');

const commonOpts = {
  windowMs: 60 * 1000, // 1 minute
  standardHeaders: true,
  legacyHeaders: false,
};

const loginLimiter = rateLimit({
  ...commonOpts,
  limit: 5,
  message: { message: 'Trop de tentatives de connexion. Réessayez dans une minute.' },
});

const contactLimiter = rateLimit({
  ...commonOpts,
  limit: 5,
  message: { message: 'Trop de requêtes. Réessayez dans une minute.' },
});

const photoboothLimiter = rateLimit({
  ...commonOpts,
  limit: 5,
  message: { message: 'Trop de requêtes. Réessayez dans une minute.' },
});

module.exports = { loginLimiter, contactLimiter, photoboothLimiter };
