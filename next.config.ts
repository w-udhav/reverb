import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  serverExternalPackages: [
    "metascraper",
    "metascraper-author",
    "metascraper-date",
    "metascraper-description",
    "metascraper-image",
    "metascraper-logo",
    "metascraper-publisher",
    "metascraper-title",
    "metascraper-url",
    "re2",
    "url-regex-safe",
  ],
};

export default nextConfig;
