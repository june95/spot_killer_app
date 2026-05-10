import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@spot-killer/ui"],
  typedRoutes: true,
};

export default nextConfig;
