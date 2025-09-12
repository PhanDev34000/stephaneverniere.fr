const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");
const { HttpRequest } = require("@smithy/protocol-http");
const { formatUrl } = require("@aws-sdk/util-format-url");
const { parseUrl } = require("@smithy/url-parser");
const { Hash } = require("@smithy/hash-node");

exports.getPresignedUrl = async (Key, ContentType="application/octet-stream") => {
  const presigner = new S3RequestPresigner({
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    region: "auto",
    sha256: Hash.bind(null, "sha256"),
  });

  const url = await presigner.presign(
    new HttpRequest({
      ...parseUrl(process.env.R2_ENDPOINT),
      method: "PUT",
      protocol: "https:",
      path: `/${Bucket}/${Key}`,
      headers: {
        host: new URL(process.env.R2_ENDPOINT).host,
        "content-type": ContentType,
      },
    })
  );

  return formatUrl(url);
};
