// tests/auth.controller.test.js
const authController = require('../controllers/auth.controller'); // adapte le chemin si besoin
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/user.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('auth.controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.resetAllMocks();

    // faux res pour capturer status/json
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // requête de base
    req = { body: {} };

    // jwt.sign renvoie un token factice
    jwt.sign.mockReturnValue('fake-jwt-token');
  });

  describe('createUser', () => {
    it('hash le mot de passe et crée l\'utilisateur', async () => {
      req.body = { identifiant: 'client1', password: 'secret', clientNom: 'C1' };

      // bcrypt.hash renvoie un hash factice
      bcrypt.hash.mockResolvedValue('hashed-password');

      // User.create résout un objet user simulé
      User.create.mockResolvedValue({ _id: 'u1', identifiant: 'client1' });

      await authController.createUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        identifiant: 'client1',
        password: 'hashed-password',
        role: 'utilisateur'
      }));

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 'u1',
        identifiant: 'client1'
      }));
    });

    it('retourne 400 si User.create échoue', async () => {
      req.body = { identifiant: 'client1', password: 'secret' };

      bcrypt.hash.mockResolvedValue('hashed-password');
      User.create.mockRejectedValue(new Error('dup key'));

      await authController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Erreur création utilisateur'
      }));
    });
  });

  describe('login', () => {
    it('retourne 400 si identifiant/email ou password manquent', async () => {
      req.body = { }; // vide
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Identifiant')
      }));
    });

    it('retourne 401 si utilisateur introuvable', async () => {
      req.body = { identifiant: 'doesnotexist', password: 'x' };
      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ identifiant: 'doesnotexist' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Identifiants invalides' }));
    });

    it('retourne 403 si compte désactivé', async () => {
      req.body = { identifiant: 'client1', password: 'x' };
      User.findOne.mockResolvedValue({ _id: 'u1', password: 'h', isActive: false });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Compte désactivé' }));
    });

    it('retourne 401 si password incorrect', async () => {
      req.body = { identifiant: 'client1', password: 'bad' };
      User.findOne.mockResolvedValue({ _id: 'u1', password: 'h', isActive: true });

      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('bad', 'h');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Identifiants invalides' }));
    });

    it('renvoie token et user si credentials corrects', async () => {
      req.body = { identifiant: 'client1', password: 'good' };

      const dbUser = {
        _id: 'u1',
        identifiant: 'client1',
        role: 'utilisateur',
        email: 'c1@mail',
        isActive: true,
        password: 'hashed'
      };

      User.findOne.mockResolvedValue(dbUser);
      bcrypt.compare.mockResolvedValue(true);

      await authController.login(req, res);

      // jwt.sign doit être appelé avec le payload attendu
      expect(jwt.sign).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'u1',
        role: 'utilisateur',
        identifiant: 'client1'
      }), expect.any(String), expect.any(Object));

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        token: 'fake-jwt-token',
        user: expect.objectContaining({
          _id: 'u1',
          identifiant: 'client1',
          role: 'utilisateur'
        })
      }));
    });

    it('renvoie 500 en cas d\'erreur serveur inattendue', async () => {
      req.body = { identifiant: 'client1', password: 'good' };
      User.findOne.mockRejectedValue(new Error('boom'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Erreur serveur' }));
    });
  });
});
