const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");
const { HttpRequest } = require("@smithy/protocol-http");
const { formatUrl } = require("@aws-sdk/util-format-url");

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true, // obligatoire avec R2
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const Bucket = process.env.R2_BUCKET;

// Upload direct (rarement utilisé maintenant)
exports.put  = (Key, Body, ContentType='application/octet-stream') =>
  client.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));

// Lister objets
exports.list = (Prefix) => client.send(new ListObjectsV2Command({ Bucket, Prefix }));

// Générer URL présignée
exports.getPresignedUrl = async (Key, ContentType="application/octet-stream") => {
  const presigner = new S3RequestPresigner({ client, region: "auto" });

  const url = await presigner.presign(
    new HttpRequest({
      ...client.config,
      method: "PUT",
      protocol: "https:",
      path: `/${Bucket}/${Key}`,
      headers: {
        host: client.config.endpoint.hostname,
        "content-type": ContentType,
      },
    })
  );

  return formatUrl(url);
};
