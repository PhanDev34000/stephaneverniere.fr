const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true, // important avec R2
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const Bucket = process.env.R2_BUCKET;

exports.ping = () => client.send(new ListObjectsV2Command({ Bucket, MaxKeys: 1 }));
exports.put  = (Key, Body, ContentType='application/octet-stream') =>
  client.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));
exports.list = (Prefix) => client.send(new ListObjectsV2Command({ Bucket, Prefix }));
