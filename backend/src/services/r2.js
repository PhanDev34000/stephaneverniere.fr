// src/services/r2.js
const { S3Client, PutObjectCommand, ListObjectsV2Command, HeadBucketCommand } = require('@aws-sdk/client-s3');

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const Bucket = process.env.R2_BUCKET;

exports.ping = () => client.send(new HeadBucketCommand({ Bucket }));
exports.put  = (Key, Body, ContentType='application/octet-stream') =>
  client.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));
exports.list = (Prefix) => client.send(new ListObjectsV2Command({ Bucket, Prefix }));
