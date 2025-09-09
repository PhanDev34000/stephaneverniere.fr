require('dotenv').config();
const cloudinary = require('../config/cloudinary'); // ton config/cloudinary.js

(async () => {
  const TARGET = 'stephane/prestations/prestations';

  async function wipe(folderPath) {
    // 1) Supprime toutes les images (dans ce dossier et ses sous-dossiers)
    await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'image' }).catch(()=>{});

    // 2) Supprime récursivement les sous-dossiers
    const { folders = [] } = await cloudinary.api.sub_folders(folderPath).catch(() => ({ folders: [] }));
    for (const f of folders) await wipe(f.path);

    // 3) Supprime le dossier lui-même
    await cloudinary.api.delete_folder(folderPath).catch(()=>{});
  }

  await wipe(TARGET);
  console.log('✅ Dossier supprimé :', TARGET);
})();
