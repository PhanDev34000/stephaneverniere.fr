const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const Bucket = process.env.R2_BUCKET;

// Générer une URL présignée pour upload
exports.getPresignedUrl = async (Key, ContentType = 'application/octet-stream') => {
  const command = new PutObjectCommand({
    Bucket,
    Key,
    ContentType,
  });

  return await getSignedUrl(client, command, { expiresIn: 3600 }); // URL valable 1h
};
