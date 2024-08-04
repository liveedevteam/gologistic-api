import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3 } from "./awsConfig";

export const getSignedUrlForGet = async (
  params: GetObjectCommandInput
): Promise<string> => {
  const command = new GetObjectCommand(params);
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return signedUrl;
};

export const uploadToS3 = async (
  originalname: string,
  buffer: Buffer,
  folder: string
) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || "loops-storage-bucket ",
    Key: `${folder}/${originalname}`,
    Body: buffer,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    const signedUrl = await getSignedUrlForGet({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${originalname}`,
    });
    return {
      url: signedUrl,
      key: `${folder}/${originalname}`,
    };
  } catch (error) {
    return error;
  }
};
