import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiImagePattern = apiUrl
  ? (() => {
      const { protocol, hostname, port } = new URL(apiUrl);
      return {
        protocol: protocol.slice(0, -1) as "http" | "https",
        hostname,
        port,
        pathname: "/**",
      };
    })()
  : null;

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const configuredApiUrl = apiUrl?.replace(/\/+$/, "");

    if (!configuredApiUrl) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${configuredApiUrl}/api/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${configuredApiUrl}/auth/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: apiImagePattern ? [apiImagePattern] : [],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
