import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
};

export default nextConfig;
