const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

exports.getPresignedUrl = async (Key, ContentType="application/octet-stream") => {
  const command = new PutObjectCommand({
    Bucket,
    Key,
    ContentType,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 }); // 1h
  return url;
};
