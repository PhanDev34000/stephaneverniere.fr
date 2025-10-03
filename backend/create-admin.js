require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/user.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stephaneverniere';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);

    const identifiant = '@AdminSV_site-photo!';      
    const password = process.env.ADMIN_PASSWORD;      
    const hash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      identifiant,
      password: hash,
      role: 'admin',
      clientNom: 'Stephane Verniere',
      clientEmail: 'vernierestephane@gmail.com'
    });

    console.log('✅ Admin créé :', admin.identifiant);
    process.exit(0);
  } catch (err) {
    console.error('Erreur création admin :', err.message);
    process.exit(1);
  }
}

createAdmin();
