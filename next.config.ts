import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  output: "standalone",
  async headers() {
    return [
      {
        // Stop browsers from MIME-sniffing responses (Invicti, DATASHARE-281)
        source: "/:path*",
        headers: [{ key: "X-Content-Type-Options", value: "nosniff" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Retired Tools and Resources page -> INS resources hash route, 301 for SEO (DATASHARE-285).
        // Done here rather than on the ALB because ALB redirects can't include a "#" fragment.
        source: "/post/Data/cancer-data-resources/",
        destination: "https://studycatalog.cancer.gov/#/resources",
        statusCode: 301,
      },
    ];
  },
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
