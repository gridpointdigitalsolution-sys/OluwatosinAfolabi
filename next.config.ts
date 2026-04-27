import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@anthropic-ai/sdk"],
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
