import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
         protocol: 'https',
         hostname: 'pub-7802e0a5106e4c31a8f2933f23cb4fa6.r2.dev', // ваш новый публичный домен
         pathname: '/**',
       },
      {
        protocol: 'https',
        // Добавьте hostname с префиксом "crix."
        hostname: 'crix.43a7d037da248338d892c8de5e9081b0.r2.cloudflarestorage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        // И без префикса на всякий случай
        hostname: '43a7d037da248338d892c8de5e9081b0.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);