import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["groq-sdk"],
  images: {
    // Serve images as plain static files — avoids Hostinger routing
    // /_next/image through the optimisation API which can 404 on some plans
    unoptimized: true,
  },
};

export default nextConfig;
