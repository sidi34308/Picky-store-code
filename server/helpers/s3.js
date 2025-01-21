// filepath: /c:/Users/hp/Documents/GitHub/mern-ecommerce-2024/server/helpers/s3.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("files", 10); // Expecting 'files' field with a maximum of 10 files

async function imageUploadUtil(files) {
  if (!files || files.length === 0) {
    throw new Error("No files provided for upload.");
  }

  const uploadPromises = files.map(async (file) => {
    const fileExtension = file.mimetype.split("/")[1];
    const key = `${uuidv4()}.${fileExtension}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const url = await getSignedUrl(s3Client, command);
    return { url: publicUrl, key };
  });
  return Promise.all(uploadPromises);
}

module.exports = { upload, imageUploadUtil };
