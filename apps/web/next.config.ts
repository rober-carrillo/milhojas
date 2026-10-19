import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // packages/core ships TypeScript source; Next compiles it.
  transpilePackages: ["@milhojas/core"],
  // Linting runs once at the repo root (pnpm lint), not inside next build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
