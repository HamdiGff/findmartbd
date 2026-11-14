import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Temporary: product photos load from Dropshop until we copy them to our own storage.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "dropshop.com.bd" }],
  },
};

export default nextConfig;
