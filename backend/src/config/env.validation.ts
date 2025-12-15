export function validateConfig(config: Record<string, unknown>) {
  const errors: string[] = [];

  const port = Number(config.PORT ?? 3000);
  if (Number.isNaN(port)) {
    errors.push('PORT must be a number');
  }

  if (errors.length) {
    throw new Error(errors.join('; '));
  }

  return {
    ...config,
    PORT: port,
    AWS_BUCKET_NAME: config.AWS_BUCKET_NAME ?? 'aegisexam-local',
    AWS_REGION: config.AWS_REGION ?? 'ap-south-1'
  };
}
