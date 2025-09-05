import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";



const withNextIntil = createNextIntlPlugin('./src/libs/i18n/request.ts')


const nextConfig: NextConfig = {
   reactStrictMode:true
};

export default withNextIntil(nextConfig)
