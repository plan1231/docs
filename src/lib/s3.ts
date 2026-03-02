import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const s3Bucket = process.env.S3_BUCKET || '';
const s3AccessKey = process.env.S3_ACCESS_KEY || '';
const s3SecretKey = process.env.S3_SECRET_KEY || '';
const s3Region = process.env.S3_REGION || 'us-east-1';
const s3EndpointUrl = process.env.S3_ENDPOINT_URL || undefined;

const client = new S3Client({
  region: s3Region,
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
  },
  endpoint: s3EndpointUrl,
  maxAttempts: 3,
});

export interface UploadResult {
  success: boolean;
  error?: string;
}

export async function uploadFile(
  filePath: string,
  s3Key: string,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  if (!existsSync(filePath)) {
    return { success: false, error: `File not found: ${filePath}` };
  }

  try {
    const fileContent = readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: s3Bucket,
      Key: s3Key,
      Body: fileContent,
      Metadata: metadata,
    });

    await client.send(command);
    console.log(`Successfully uploaded ${filePath} to s3://${s3Bucket}/${s3Key}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`Failed to upload ${filePath}: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

export function generateS3Key(
  mediaType: 'movie' | 'episode',
  externalId: number,
  filename: string
): string {
  const ext = path.extname(filename);
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  return `${mediaType}/${externalId}/${timestamp}_${externalId}${ext}`;
}

export async function checkFileExists(s3Key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: s3Bucket,
      Key: s3Key,
    });
    await client.send(command);
    return true;
  } catch {
    return false;
  }
}

export { client };
