import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Logger } from 'nestjs-pino';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService, private readonly logger: Logger) {
    const s3Config = this.configService.get('s3') as {
      region: string;
      bucket: string;
      endpoint?: string;
      accessKeyId?: string;
      secretAccessKey?: string;
    };

    this.bucket = s3Config.bucket;
    this.s3 = new S3Client({
      region: s3Config.region,
      endpoint: s3Config.endpoint,
      forcePathStyle: Boolean(s3Config.endpoint),
      credentials:
        s3Config.accessKeyId && s3Config.secretAccessKey
          ? {
              accessKeyId: s3Config.accessKeyId,
              secretAccessKey: s3Config.secretAccessKey
            }
          : undefined
    });
  }

  async generateUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 900 });
    this.logger.log({ key, bucket: this.bucket }, 'Generated upload URL');
    return { url, key };
  }

  async generateDownloadUrl(key: string) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 900 });
    this.logger.log({ key, bucket: this.bucket }, 'Generated download URL');
    return { url, key };
  }
}
