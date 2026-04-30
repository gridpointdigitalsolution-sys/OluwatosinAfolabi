import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // groq-sdk must NOT be bundled — it crashes at runtime when Next.js bundles it
  serverExternalPackages: ["groq-sdk"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
