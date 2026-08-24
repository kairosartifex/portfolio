import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.107'],
  trailingSlash: false,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Robots-Tag",
          value: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        },
        {
          key: "Vary",
          value: "Accept",
        },
      ],
    },
  ],
};

export default nextConfig;

