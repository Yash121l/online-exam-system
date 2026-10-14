/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // PostHog reverse proxy so ad blockers don't drop analytics events.
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://us.i.posthog.com/:path*' }
    ];
  },
  // PostHog API paths end in a trailing slash.
  skipTrailingSlashRedirect: true
};

module.exports = nextConfig;
