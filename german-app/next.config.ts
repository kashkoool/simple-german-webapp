import type { NextConfig } from "next";

/**
 * Static export: no server, no API routes. Content is read-only.
 * Security headers (X-Frame-Options, etc.) are set in vercel.json for Vercel deployments.
 */
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
