'use server'

import { S3Client, 
         CreateMultipartUploadCommand, 
         UploadPartCommand, 
         CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({region: 'eu-west-1'});


export async function createMultipartUpload(key) {
  const params = {
    Bucket: 'supercar',
    Key: key
  };

  const response = await s3Client.send(new CreateMultipartUploadCommand(params));
  return response.UploadId;
}

export async function uploadPart(key, uploadId, partNumber, body) {

    const buffer = Buffer.from(body);
    const fileBuffer = buffer.buffer

  const params = {
    Bucket: 'supercar',
    Key: key,
    PartNumber: partNumber,
    UploadId: uploadId,
    Body: fileBuffer,
  };

  const response = await s3Client.send(new UploadPartCommand(params));

  return response;
}

export async function completeMultipartUpload(key, uploadId, parts) {
    const params = {
      Bucket: 'supercar',
      Key: key,
      MultipartUpload: { Parts: parts },
      UploadId: uploadId,
    };
  
    try {
      await s3Client.send(new CompleteMultipartUploadCommand(params));
    } catch (error) {
      console.error('Error completing multipart upload:', error);
      throw error;
    }

  };


