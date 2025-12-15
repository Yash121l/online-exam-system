export type AppConfig = {
  nodeEnv: string;
  port: number;
  corsOrigins: string[];
  databaseUrl: string;
  s3: {
    region: string;
    bucket: string;
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
};

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3001', 10),
  corsOrigins:
    process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? ['*'],
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgresql://aegis_exam:aegis_exam_password@localhost:5432/aegis_exam',
  s3: {
    region: process.env.AWS_REGION ?? 'ap-south-1',
    bucket: process.env.AWS_BUCKET_NAME ?? 'aegisexam-local',
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
